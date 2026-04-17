const storyTextElement = document.getElementById("story-text");
const choicesElement = document.getElementById("choices");

let gameState = {};

const story = {
  start: {
    text: "You wake up in a dark cabin. A storm rattles the windows. On the table sits a lantern and a rusted key.",
    choices: [
      {
        text: "Take the lantern.",
        next: "takeLantern",
        effects: { lantern: true }
      },
      {
        text: "Take the key.",
        next: "takeKey",
        effects: { key: true }
      },
      {
        text: "Leave the cabin immediately.",
        next: "outside"
      }
    ]
  },

  takeLantern: {
    text: "You lift the lantern. It still works. The warm glow reveals a locked trapdoor beneath a rug.",
    choices: [
      {
        text: "Check the trapdoor.",
        next: "trapdoor"
      },
      {
        text: "Go outside into the storm.",
        next: "outside"
      }
    ]
  },

  takeKey: {
    text: "You pocket the rusted key. As thunder cracks above, you notice muddy footprints leading to a rug in the center of the room.",
    choices: [
      {
        text: "Pull back the rug.",
        next: "trapdoor"
      },
      {
        text: "Go outside into the storm.",
        next: "outside"
      }
    ]
  },

  trapdoor: {
    text: "Under the rug is a locked trapdoor.",
    choices: [
      {
        text: "Use the key to unlock it.",
        next: "cellar",
        condition: (state) => state.key === true
      },
      {
        text: "Force it open with your hands.",
        next: "injuredCellar",
        condition: () => true
      },
      {
        text: "Step away and head outside.",
        next: "outside"
      }
    ]
  },

  cellar: {
    text: "The key turns. The trapdoor opens to a narrow cellar staircase. At the bottom, you find supplies, dry blankets, and a radio. You survive the storm. Ending: Prepared Survivor.",
    choices: [
      {
        text: "Play again.",
        next: "startGame"
      }
    ],
    ending: true
  },

  injuredCellar: {
    text: "You wrench the trapdoor open and tear your hand badly. Still, you find shelter below and make it through the night. Ending: Hurt But Alive.",
    choices: [
      {
        text: "Play again.",
        next: "startGame"
      }
    ],
    ending: true
  },

  outside: {
    text: "You step into the storm. The rain is brutal, the woods almost invisible. In the distance you spot a faint light.",
    choices: [
      {
        text: "Walk toward the light.",
        next: "light"
      },
      {
        text: "Try to survive in the woods.",
        next: "woods"
      }
    ]
  },

  light: {
    text: "You reach a ranger station. The door is open, but something feels wrong.",
    choices: [
      {
        text: "Go inside.",
        next: "safeEnding",
        condition: (state) => state.lantern === true
      },
      {
        text: "Go inside anyway.",
        next: "badEnding",
        condition: (state) => state.lantern !== true
      }
    ]
  },

  woods: {
    text: "Without shelter or supplies, the storm overwhelms you before dawn. Ending: Lost in the Dark.",
    choices: [
      {
        text: "Play again.",
        next: "startGame"
      }
    ],
    ending: true
  },

  safeEnding: {
    text: "Using the lantern, you notice the station floor is unstable and avoid a collapse. You wait out the storm safely. Ending: Sharp-Eyed Survivor.",
    choices: [
      {
        text: "Play again.",
        next: "startGame"
      }
    ],
    ending: true
  },

  badEnding: {
    text: "You rush into the ranger station and the floor gives way beneath you. Ending: One Bad Decision Too Many.",
    choices: [
      {
        text: "Play again.",
        next: "startGame"
      }
    ],
    ending: true
  }
};

function startGame() {
  gameState = {};
  renderNode("start");
}

function renderNode(nodeId) {
  if (nodeId === "startGame") {
    startGame();
    return;
  }

  const node = story[nodeId];
  storyTextElement.textContent = node.text;
  choicesElement.innerHTML = "";

  node.choices
    .filter((choice) => {
      if (!choice.condition) {
        return true;
      }

      return choice.condition(gameState);
    })
    .forEach((choice) => {
      const button = document.createElement("button");
      button.textContent = choice.text;

      button.addEventListener("click", () => {
        applyEffects(choice.effects);
        renderNode(choice.next);
      });

      choicesElement.appendChild(button);
    });
}

function applyEffects(effects) {
  if (!effects) {
    return;
  }

  Object.keys(effects).forEach((key) => {
    gameState[key] = effects[key];
  });
}

startGame();
