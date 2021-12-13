var fs = require("fs");

let flowers = JSON.parse(fs.readFileSync("data.json"));
let blocksData = JSON.parse(fs.readFileSync("RP/blocks.json").toString());
let textureData = JSON.parse(
  fs.readFileSync("RP/textures/terrain_texture.json").toString()
);
let itemTextureData = JSON.parse(
  fs.readFileSync("RP/textures/item_texture.json").toString()
);
let langData = fs.readFileSync("RP/texts/en_US.lang").toString();

flowers.forEach(createJSON);

function titleCase(str) {
  var langString = str.replace(/_/g, " ").split(" ");
  for (var i = 0; i < langString.length; i++) {
    langString[i] =
      langString[i].charAt(0).toUpperCase() + langString[i].substring(1);
  }
  return langString.join(" ");
}

function createJSON(flowerType) {
  var flowerTypeBouquet = flowerType + "_bouquet";
  var ffFlowerTypeBouquet = "ff:" + flowerType + "_bouquet";
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
        "minecraft:loot": `loot_tables/blocks/${flowerType}_bouquet.json`,
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
            table: `loot_tables/blocks/${flowerType}_bouquet.json`,
          },
          decrement_stack: {},
          run_command: {
            command: ["particle minecraft:crop_growth_emitter ~ ~ ~"],
          },
        },
      },
    },
  };
  let itemData = {
    format_version: "1.16.100",
    "minecraft:item": {
      description: {
        identifier: `ff:${flowerType}_bouquet_item`,
        category: "nature",
      },
      components: {
        "minecraft:block_placer": {
          block: `ff:${flowerType}_bouquet`,
          use_on: ["grass", "dirt", "podzol", "moss_block", "dirt_with_roots"],
        },
        "minecraft:icon": { texture: `${flowerType}_bouquet` },
        "minecraft:creative_category": { parent: "itemGroup.name.flower" },
        "tag:flower": {},
        "minecraft:max_stack_size": 64,
        "minecraft:stacked_by_data": true,
        "minecraft:on_use_on": { on_use_on: { event: "sound" } },
      },
      events: {
        sound: {
          run_command: {
            command: ["playsound dig.grass @a[r=5] ~ ~ ~ 0.4 1.0"],
          },
        },
      },
    },
  };
  let featureData = {
    format_version: "1.13.0",
    "minecraft:single_block_feature": {
      description: {
        identifier: `ff:${flowerType}/${flowerType}_bouquet_feature`,
      },
      places_block: { name: `ff:${flowerType}_bouquet` },
      enforce_survivability_rules: true,
      enforce_placement_rules: true,
    },
  };
  let lootData = {
    pools: [
      {
        rolls: 1,
        entries: [
          {
            type: "item",
            name: `ff:${flowerType}_large_item`,
            weight: 1,
            functions: [{ function: "set_count", count: { min: 1, max: 1 } }],
          },
        ],
      },
    ],
  };
  let recipeData = {
    format_version: 1.12,
    "minecraft:recipe_shapeless": {
      description: {
        identifier: `ff:${flowerType}_into_${flowerType}_bouquet`,
      },
      tags: ["crafting_table"],
      ingredients: [{ item: `ff:${flowerType}_item`, count: 9 }],
      result: { item: `ff:${flowerType}_bouquet_item`, count: 1 },
    },
  };
  let recipeData2 = {
    format_version: 1.12,
    "minecraft:recipe_shapeless": {
      description: {
        identifier: `ff:${flowerType}_bouquet_into_${flowerType}`,
      },
      tags: ["crafting_table"],
      ingredients: [{ item: `ff:${flowerType}_bouquet_item`, count: 1 }],
      result: { item: `ff:${flowerType}_item`, count: 9 },
    },
  };
  fs.writeFileSync(
    `BP/recipes/${flowerType}/${flowerType}_into_${flowerType}_bouquet.json`,
    JSON.stringify(recipeData, null, "  ")
  );
  fs.writeFileSync(
    `BP/recipes/${flowerType}/${flowerType}_bouquet_into_${flowerType}.json`,
    JSON.stringify(recipeData2, null, "  ")
  );
  fs.writeFileSync(
    `BP/blocks/${flowerType}/${flowerType}_bouquet.json`,
    JSON.stringify(blockData, null, "  ")
  );
  fs.writeFileSync(
    `BP/items/${flowerType}/${flowerType}_bouquet.json`,
    JSON.stringify(itemData, null, "  ")
  );
  fs.writeFileSync(
    `BP/features/${flowerType}/${flowerType}_bouquet_feature.json`,
    JSON.stringify(featureData, null, "  ")
  );
  fs.writeFileSync(
    `BP/loot_tables/blocks/${flowerType}/${flowerType}_bouquet.json`,
    JSON.stringify(lootData, null, "  ")
  );
  langName = titleCase(flowerType);
  langData += `\nitem.ff:${flowerType}_bouquet_item=${langName} Bouquet`;
  blocksData[ffFlowerTypeBouquet] = { sound: "grass" };
  textureData.texture_data[flowerTypeBouquet] = {
    textures: `textures/blocks/${flowerType}/${flowerTypeBouquet}`,
  };
  itemTextureData.texture_data[flowerTypeBouquet] = {
    textures: `textures/items/${flowerType}/${flowerTypeBouquet}`,
  };
}
fs.writeFileSync(`RP/texts/en_US.lang`, langData);
fs.writeFileSync(`RP/blocks.json`, JSON.stringify(blocksData, null, "  "));
fs.writeFileSync(
  `RP/textures/terrain_texture.json`,
  JSON.stringify(textureData, null, "  ")
);
fs.writeFileSync(
  `RP/textures/item_texture.json`,
  JSON.stringify(itemTextureData, null, "  ")
);
