export default function(question) {
  const instructions = question.instructions;

  console.log("instructions", instructions);

  const gameStatus = {
    playerLocation: new Location(question.startX, question.startY),
    treasureLocation: new Location(question.treasureX, question.treasureY),
    pirateLocation: new Location(question.pirateX, question.pirateY),
    spyLocation: new Location(question.spyX, question.spyY),
    treasureFound: false,
    isFollowedBySpy: false,
    treasureStolenBySpy: false,
    treasureStolenByPirate: false,
    spyIsInjured: false,
    pirateIsInjured: false
  };

  console.log(
    "start location",
    gameStatus.playerLocation.x,
    gameStatus.playerLocation.y
  );
  console.log(
    "pirate location",
    gameStatus.pirateLocation.x,
    gameStatus.pirateLocation.y
  );
  console.log(
    "spy location",
    gameStatus.spyLocation.x,
    gameStatus.spyLocation.y
  );
  console.log(
    "treasure location",
    gameStatus.treasureLocation.x,
    gameStatus.treasureLocation.y
  );

  updateTreasureStatus(gameStatus);

  const instructionProcessor = {
    F: gameStatus.playerLocation.moveForward,
    B: gameStatus.playerLocation.moveBackward,
    L: gameStatus.playerLocation.moveLeft,
    R: gameStatus.playerLocation.moveRight
  };

  for (let step of instructions) {
    instructionProcessor[step]();

    updateTreasureStatus(gameStatus);
  }

  return {
    endX: gameStatus.playerLocation.x,
    endY: gameStatus.playerLocation.y,
    treasureOwner: getTreasureOwner(gameStatus)
  };
}

function updateTreasureStatus(gameStatus) {
  if (!gameStatus.treasureFound) {
    gameStatus.treasureFound = isTreasureFound(
      gameStatus.playerLocation,
      gameStatus.treasureLocation
    );
  }

  if (!gameStatus.isFollowedBySpy) {
    gameStatus.isFollowedBySpy = bumpIntoSpy(
      gameStatus.playerLocation,
      gameStatus.spyLocation
    );
  }

  let pirateInCurrentLocation = bumpIntoPirate(
    gameStatus.playerLocation,
    gameStatus.pirateLocation
  );

  if (
    gameStatus.isFollowedBySpy &&
    !gameStatus.spyIsInjured &&
    !pirateInCurrentLocation
  ) {
    if (treasureBelongsToMe(gameStatus)) {
      gameStatus.treasureStolenBySpy = true;
      console.log(
        "treasure stolen by spy at location ",
        gameStatus.playerLocation.x,
        gameStatus.playerLocation.y
      );
    }
  }

  if (
    !gameStatus.isFollowedBySpy &&
    pirateInCurrentLocation &&
    !gameStatus.pirateIsInjured
  ) {
    if (treasureBelongsToMe(gameStatus)) {
      gameStatus.treasureStolenByPirate = true;
      console.log(
        "treasure stolen by pirate at location ",
        gameStatus.playerLocation.x,
        gameStatus.playerLocation.y
      );
    }
  }

  if (
    gameStatus.isFollowedBySpy &&
    !gameStatus.spyIsInjured &&
    gameStatus.treasureStolenBySpy &&
    pirateInCurrentLocation &&
    !gameStatus.pirateIsInjured
  ) {
    gameStatus.treasureStolenBySpy = false;
    gameStatus.pirateIsInjured = true;
    gameStatus.spyIsInjured = true;

    console.log(
      "pirate and spy fight at location ",
      gameStatus.playerLocation.x,
      gameStatus.playerLocation.y
    );
  }
}

function getTreasureOwner(gameStatus) {
  if (!gameStatus.treasureFound) {
    return "no-one";
  }

  if (gameStatus.treasureStolenByPirate) {
    return "pirate";
  }

  if (gameStatus.treasureStolenBySpy) {
    return "spy";
  }

  return "me";
}

function treasureBelongsToMe(gameStatus) {
  return (
    gameStatus.treasureFound &&
    !gameStatus.treasureStolenByPirate &&
    !gameStatus.treasureStolenBySpy
  );
}

function isTreasureFound(myLocation, treasureLocation) {
  return myLocation.equals(treasureLocation);
}

function bumpIntoPirate(myLocation, pirateLocation) {
  return myLocation.equals(pirateLocation);
}

function bumpIntoSpy(myLocation, spyLocation) {
  return myLocation.equals(spyLocation);
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
