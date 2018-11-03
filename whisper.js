export default function(question) {
  const location = new Location(question.startX, question.startY);
  const treasureLocation = new Location(question.treasureX, question.treasureY);
  const pirateLocation = new Location(question.pirateX, question.pirateY);

  const instructions = question.instructions;

  let treasureFound = isTreasureFound(location, treasureLocation);
  let treasureStolen =
    treasureFound && meetWithPirate(location, pirateLocation);

  const instructionProcessor = {
    F: location.moveForward,
    B: location.moveBackward,
    L: location.moveLeft,
    R: location.moveRight
  };

  for (let step of instructions) {
    instructionProcessor[step]();

    if (shouldSearchForTreasure(treasureFound)) {
      treasureFound = isTreasureFound(location, treasureLocation);
    }

    if (shouldDetectPirate(treasureFound, treasureStolen)) {
      treasureStolen = meetWithPirate(location, pirateLocation);
    }
  }

  return { endX: location.x, endY: location.y, treasureFound, treasureStolen };
}

function shouldSearchForTreasure(treasureFound) {
  return !treasureFound;
}

function shouldDetectPirate(treasureFound, treasureStolen) {
  return treasureFound && !treasureStolen;
}
function isTreasureFound(myLocation, treasureLocation) {
  return myLocation.equals(treasureLocation);
}

function meetWithPirate(myLocation, pirateLocation) {
  return myLocation.equals(pirateLocation);
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
