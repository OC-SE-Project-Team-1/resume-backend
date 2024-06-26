const fs = require('fs');

languages = {};
fs.readFile('languages.json', 'utf8', (err, data) => {
    if (err){
        console.log(err);
    } else {
        languages = JSON.parse(data); //now it an object
        console.log(languages);
    }
});

function isDuplicate(check) {
    let arr = [];
    for (let i = 0; i < languages.list.length; i++) {
        arr.push(languages.list[i].language);
    }
    arr.push(check.language);

    let set = new Set(arr);
    return set.size !== arr.length;
}

exports.create = (req, res) => {
    // Check for language definition
    if (req.body.language === undefined) {
        const error = new Error("Language cannot be empty for Language");
        error.statusCode = 400;
        throw error;
    }

    // Create new language
    const language = {
        // Id: next in list
        id: languages.list[languages.list.length - 1].id + 1,
        // Language: first letter capitalized
        language: req.body.language[0].toUpperCase() + req.body.language.substring(1).toLowerCase()
    };

    // Check for duplicates
    if (isDuplicate(language)) {
        const error = new Error("Language already exists");
        error.statusCode = 400;
        throw error;
    }

    // Add language to list
    languages.list.push(language);
    var json = JSON.stringify(languages);

    // Write new language to file
    fs.writeFile("languages.json", json, 'utf8', () => {
        res.send(language);
    });
}

exports.findAll = (req, res) => {
    res.send(languages.list);
}

exports.findOne = (req, res) => {
    res.send(languages.list[req.params.id - 1]);
}

exports.update = (req, res) => {
    let newLanguage = {
        id: req.body.id,
        language: req.body.language,
    }
    languages.list[req.params.id - 1] = newLanguage;
    res.status(200).send({ message: "Language updated successfully."});
}

exports.delete = (req, res) => {
    let id = req.params.id;
    languages.list.splice(id - 1, 1);
    res.status(200).send({ message: "Language deleted successfully."});
}