export default function(question) {
  const location = new Location(question.startX, question.startY);
  const treasureLocation = new Location(question.treasureX, question.treasureY);

  const instructions = question.instructions;

  let treasureFound = false;

  if (location.equals(treasureLocation)) {
    treasureFound = true;
  }

  const instructionProcessor = {
    F: location.moveForward,
    B: location.moveBackward,
    L: location.moveLeft,
    R: location.moveRight
  };

  for (let step of instructions) {
    instructionProcessor[step]();

    if (location.equals(treasureLocation)) {
      treasureFound = true;
    }
  }

  return { endX: location.x, endY: location.y, treasureFound };
}

class Location {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.moveForward = this.moveForward.bind(this);
    this.moveBackward = this.moveBackward.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
  }

  equals(anotherLocation) {
    return this.x === anotherLocation.x && this.y === anotherLocation.y;
  }

  moveForward() {
    this.x += 1;
  }

  moveBackward() {
    this.x -= 1;
  }

  moveLeft() {
    this.y += 1;
  }

  moveRight() {
    this.y -= 1;
  }
}
