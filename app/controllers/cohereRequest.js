const cohere_ai = require("cohere-ai");
const cohere = new cohere_ai.CohereClient({
    token: "LYZKnMXkpXQsVHQBxLNEGZrs8EhKoUOGRpUbyIR2",
});

exports.SendCohereRequest = async (request, history) => {
    const stream = await cohere.chatStream({
        message: request,
        preamble: "You are a resume analyst who helps people write professional resumes.",
        chatHistory: history
    });

    var response = "";
    for await (const chat of stream) {
        if (chat.eventType === "text-generation") {
            response += chat.text;
        }
    }

    console.log(response);
    return response;
}

exports.SaveAIAssist = (hist, req, res) => {
    hist.push({ role: "USER", message: req });
    hist.push({ role: "CHATBOT", message: res });
    const response = {
        description: res,
        history: hist
    };

    return response;
}