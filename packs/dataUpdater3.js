const fs = require('fs')

let flowers = JSON.parse(fs.readFileSync("./data.json"));
flowers.forEach(createJSON);

function createJSON(flowerType) {
  let blockData = {
    format_version: "1.16.100",
    "minecraft:block": {
      description: {
        identifier: `ff:${flowerType}_bouquet`,
      },
      components: {
        "minecraft:placement_filter": {
          conditions: [
            {
              allowed_faces: ["up"],
              block_filter: [
                "minecraft:grass",
                "minecraft:dirt",
                "minecraft:podzol",
                "minecraft:moss_block",
              ],
            },
          ],
        },
        "minecraft:loot": `loot_tables/blocks/${flowerType}/${flowerType}_bouquet.json`,
        "minecraft:geometry": "geometry.large_fern",
        "minecraft:material_instances": {
          "*": {
            render_method: "alpha_test",
            texture: `${flowerType}_bouquet`,
            face_dimming: false,
            ambient_occlusion: false,
          },
        },
        "minecraft:entity_collision": false,
        "minecraft:block_light_absorption": 0,
        "minecraft:destroy_time": 0,
        "minecraft:breathability": "air",
        "minecraft:breakonpush": true,
        "minecraft:on_interact": {
          condition: "q.get_equipped_item_name=='bone_meal'",
          event: "fertilize_block",
        },
      },
      events: {
        fertilize_block: {
          spawn_loot: {
            table: `loot_tables/blocks/${flowerType}/${flowerType}_bouquet.json`,
          },
          decrement_stack: {},
          run_command: {
            command: ["particle minecraft:crop_growth_emitter ~ ~ ~"],
          },
        },
      },
    },
  };
  fs.writeFileSync(
    `BP/blocks/${flowerType}/${flowerType}_bouquet.json`,
    JSON.stringify(blockData, null, "  ")
  );
}