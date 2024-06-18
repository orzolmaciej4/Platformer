# Platformer
The Unfinished Platformer Game is a project in development, aiming to create an immersive gaming experience where players traverse various levels, avoid enemies, collect coins, and progress through different biomes and worlds.

## Key Features and Components:
- Gameplay Mechanics:
  - Level Traversal: Players navigate through multiple levels within distinct biomes such as Caves, Forest, Mountains, and Snow.
  - Enemy Avoidance: Challenges include evading enemies strategically placed throughout the levels.
  - Coin Collection: Players accumulate coins scattered across the levels to gain lives and to potentially use in a future shop system.
  - Biome Selection: At the end of each world (e.g., Caves), players can choose their next destination, which would follow the suggested branching progression system in plan.html

## Code and Structure Overview:
- Scene Scripts: Each biome (Caves, Forest, Mountains, Snow) has its JavaScript files (Caves.js, Forest.js, Mountains.js, Snow.js) defining level-specific behaviors and layouts.
- Game Management: Central game logic is housed in game.js, responsible for overall game flow, handling player interactions, and managing scene transitions.
- User Interface: index.html serves as the entry point, providing the structure for embedding the game within a web browser.
- Additional Functionalities: Supporting scripts include StartScene.js for initiating gameplay, Shop.js for future commerce mechanics, GameOver.js for handling end-game scenarios, and Test.js for testing functionalities.

## Development Status and Ideas:
- Incomplete Levels: Most levels and assets, including the shop system, remain unfinished or placeholders.
- Shop: The player would be able to access the shop level multiple times throughout the course of a playthrough in order to purchase a variety of items, such as extra lives and weapons, or abilities such as double jump
- Planning Document: plan.html outlines the overarching vision and roadmap for the game's development and feature integration.
- Endings: Depending on how the player does throughout their playthrough, there would be a variety of endings available to them, which are highlighted in the plan document.

## Setup
Both the current version of the game and the plan can be accessed by opening the index.html and plan.html files respectively

## Technologies Used:
- HTML5, CSS: Provides foundational elements and styling for the game's graphical interface.
- JavaScript: Implements interactive elements, game mechanics, and scene-specific behaviors.
