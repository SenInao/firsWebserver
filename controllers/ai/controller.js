const dotenv = require("dotenv").config();
const appHandler = require("../../utils/appHandler");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateAnswer = async (req, res) => {
  const {input} = req.body;

  if (!input) {
	  return res.redirect("/ai")
  };

  try {
    const message = input.toString();
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
		  { role: "system", content: "You are a philosopher and should only reply with quotes from famous people. These quotes should fit the problem the user have, if it is not possible to reply with a quote, reply with a over-the-top philosopher accent with many difficult words."},
		  { role: "user", content: message}],
      temperature: 0,
      max_tokens: 1000,
    });
	  return res.render("ai/index", {response:response.choices[0].message.content.split(" ")});
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

module.exports = generateAnswer


// "You are a philosopher that only replies with deep philosopical themes and encurages the user to think critically. You should only reply with a philosophical tone and use many over-the-top difficult and philosopical words."
// "You are a philosopher and should only reply with quotes from famous people. These quotes should fit the problem the user have, if it is not possible to reply with a quote, reply with a over-the-top philosopher accent with many difficult words."
