export default function(question) {
  let start = question.start;
  let forwardSteps = (question.instructions.match(new RegExp("F", "g")) || [])
    .length;
  return { end: start + forwardSteps };
}
