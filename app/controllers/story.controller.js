const db = require("../models");
const Story = db.story;
const User = db.user;
const Op = db.Sequelize.Op;
const cohere_ai = require("cohere-ai");
const cohere = new cohere_ai.CohereClient({
    token: "LYZKnMXkpXQsVHQBxLNEGZrs8EhKoUOGRpUbyIR2",
});

// Story length variables
const short = { min: 200, max: 350 };
const medium = { min: 350, max: 500 };
const long = { min: 500, max: 650 };

function ValidateCreate(req) {
    // Validate non-array items
    if (req.body.genres.length < 1) {
        const error = new Error("Genre cannot be empty for Story");
        error.statusCode = 400;
        throw error;
    } else if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty for Story");
        error.statusCode = 400;
        throw error;
    } else if (req.body.location === undefined) {
        const error = new Error("Location cannot be empty for Story");
        error.statusCode = 400;
        throw error;
    } else if (req.body.timePeriod === undefined) {
        const error = new Error("Time Period cannot be empty for Story");
        error.statusCode = 400;
        throw error;
    } else if (req.body.characters.length < 1) {
        const error = new Error("Characters cannot be empty for Story");
        error.statusCode = 400;
        throw error;
    } else if (req.body.language === undefined) {
        const error = new Error("Language cannot be empty for Story");
        error.statusCode = 400;
        throw error;
    }  else if (req.body.length === undefined) {
        const error = new Error("Length cannot be empty for Story");
        error.statusCode = 400;
        throw error;
    }

    // Validate characters
    for (let i = 0; i < req.body.characters.length; i++) {
        if (req.body.characters[i].name === undefined) {
            const error = new Error("Character Name cannot be empty for Story");
            error.statusCode = 400;
            throw error;
        } else if (req.body.characters[i].role === undefined) {
            const error = new Error("Character Role cannot be empty for Story");
            error.statusCode = 400;
            throw error;
        }
    }
}

function CreateStoryRequest(settings, length) {
    let request = `Write me a ${settings.length} ${settings.genres[0]}`; 
    if(settings.genres.length > 1) {
        request = `${request} ${settings.genres[1]}`;
    }

    request = `${request} story in ${settings.location} and ${settings.timePeriod}.
The characters are:
`;

    for (let i = 0; i < settings.characters.length; i++) {
        request = `${request}${settings.characters[i].name} who is a ${settings.characters[i].role}
`;
    }
    
    request = `${request}Write this in ${settings.language}. Don't give a title. The story should be between ${length.min} and ${length.max} words.`;
    return request;
}

async function SendCohereRequest(request) {
    const stream = await cohere.chatStream({
        message: request,
        preamble: "You are a story-teller who tells short children's stories.",
    });

    var response = "";
    for await (const chat of stream) {
        if (chat.eventType === "text-generation") {
            response += chat.text;
        }
    }

    return response;
}

async function SendCohereRequestWithHistory(request, history) {
    const stream = await cohere.chatStream({
        message: request,
        preamble: "You are a story-teller who tells short children's stories.",
        chatHistory: history,
    });

    var response = "";
    for await (const chat of stream) {
        if (chat.eventType === "text-generation") {
            response += chat.text;
        }
    }

    return response;
}

// Create and Save a new character name
exports.generateStory = async (req, res) => {
    // Validate request
    ValidateCreate(req);

    // Create story parameters
    let storySettings = req.body;
    let length = "";
    if (storySettings.length.toLowerCase() === "short") {
        length = short;
    } else if (storySettings.length.toLowerCase() === "medium") {
        length = medium;
    } else if (storySettings.length.toLowerCase() === "long") {
        length = long;
    } else {
        const error = new Error("Invalid story length. Must be short, medium, or long");
        error.statusCode = 400;
        throw error;
    }

    let request = CreateStoryRequest(storySettings, length);

    let story = await SendCohereRequest(request)
    let history = [
        { role: "USER", message: request },
        { role: "CHATBOT", message: story }
    ];
    let title = await SendCohereRequestWithHistory("What is the title of the Story? Just give the title, and nothing else.", history);

    const response = {
        title: title,
        story: story
    };

    res.send(response);
};

exports.extendStory = async (req, res) => {
    let id = req.params.id;
    let original = {};

    original = await Story.findByPk(id).catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Story with id=" + id,
      });
    });
    console.log(original);

    let request = "Can you make a part 2 for this story? Get straight to the story. Make it between 350 and 500 words. Just give the title, and no title.";
    let history = [
        { role: "CHATBOT", message: original.title },
        { role: "CHATBOT", message: original.story }
    ];
    let extension = await SendCohereRequestWithHistory(request, history);

    let update = {
        extension: extension
    };

    res.send(update);
}

// Saves a story
exports.create = (req, res) => {
    if (req.body.title === undefined) {
        const error = new Error("Title cannot be empty for Story");
        error.statusCode = 400;
        throw error;
    } else if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty for Story");
        error.statusCode = 400;
        throw error;
    } else if (req.body.story === undefined) {
        const error = new Error("Story cannot be empty for Story");
        error.statusCode = 400;
        throw error;
    }

    const story = {
        title: req.body.title,
        story: req.body.story,
        userId: req.body.userId
    };

    Story.create(story)
        .then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send({
                message: err.message || "An error occured while saving the story.",
            });
        });
}

// Find all stories in the database
exports.findAll = (req, res) => {
    const storyId = req.query.id;
    var condition = storyId ? {
        id: {
            [Op.like]: `%${storyId}`,
        },
    } : null;

    Story.findAll({
        where: condition, 
        order: ["id"]
    }).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "An error occured while retrieving the Stories.",
        });
    });
}

// Find all stories for a user
exports.findAllForUser = (req, res) => {
    const userId = req.params.userId;
    Story.findAll({
      where: { [Op.or]: [{ userId: userId }, { userId: null }]},
      order: [
        ["id"], 
      ],
    }).then((data) => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Stories for user with id=${userId}.`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Error retrieving Stories for user with id=" + userId,
        });
    });
}

// Find a single story for a user with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Story.findByPk(id)
    .then((data) => {
      res.send(data);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Story with id=" + id,
      });
    });
}

//  Update a Story by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty");
        error.statusCode = 400;
        throw error;
      }
    Story.update(req.body, {
      where: { id: id , userId : req.body.userId},
    }).then((number) => {
        if (number == 1) {
            res.send({
                message: "Story was updated successfully.",
            });
        } else {
            res.send({
                message: `Cannot update Story with id=${id}. Maybe Story was not found or req.body is empty!`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Error updating Story with id=" + id,
        });
    });
}

// Delete a Story with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    if (req.body.userId === undefined) {
        const error = new Error("User ID cannot be empty");
        error.statusCode = 400;
        throw error;
      }
    Story.destroy({
      where: { id: id, userId : req.body.userId },
    }).then((number) => {
        if (number == 1) {
            res.send({
                message: "Story was deleted successfully!",
            });
        } else {
            res.send({
                message: `Cannot delete Story with id=${id}. Maybe Story was not found!`,
            });
        }
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Could not delete Story with id=" + id,
        });
    });
}