const fs = require('fs');
const glob = require("glob");

glob("./data/flowerFauna/**/*.json", (err, filePath) => {
  filePath.forEach((v) => {
    let tempData = JSON.parse(fs.readFileSync(v).toString())
    name(tempData.identifier, tempData.dye, tempData.tier, tempData.langName)
  });
});
function name(identifier, dye, tier, langName) {
  let blocksData = JSON.parse(fs.readFileSync("RP/blocks.json").toString());
  let textureData = JSON.parse(
    fs.readFileSync("RP/textures/terrain_texture.json").toString()
  );
  let itemTextureData = JSON.parse(
    fs.readFileSync("RP/textures/item_texture.json").toString()
  );
  let langData = fs.readFileSync("RP/texts/en_US.lang").toString();

  switch (tier) {
    case 1: {
      var blockData1 = {
        format_version: "1.16.100",
        "minecraft:block": {
          description: {
            identifier: `ff:${identifier}`,
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
                    "minecraft:dirt_with_roots",
                  ],
                },
              ],
            },
            "minecraft:loot": `loot_tables/blocks/${identifier}/${identifier}.json`,
            "minecraft:geometry": "geometry.cross",
            "minecraft:material_instances": {
              "*": {
                render_method: "alpha_test",
                texture: `${identifier}`,
                face_dimming: false,
                ambient_occlusion: false,
              },
            },
            "minecraft:entity_collision": false,
            "minecraft:block_light_absorption": 0,
            "minecraft:destroy_time": 0,
            "minecraft:breathability": "air",
            "tag:flower": {},
            "minecraft:breakonpush": true,
            "minecraft:pick_collision": {
              origin: [-3.5, 0, -3.5],
              size: [7, 10, 7],
            },
          },
          events: {},
        },
      };
      var recipeData = {
        format_version: 1.12,
        "minecraft:recipe_shapeless": {
          description: {
            identifier: `ff:dye_from_${identifier}`,
          },
          tags: ["crafting_table"],
          ingredients: [
            {
              item: `ff:${identifier}_item`,
            },
          ],
          result: {
            item: "minecraft:dye",
            data: dye,
          },
        },
      };
      var langData1 = `item.ff:${identifier}_item=${identifierName}`;

      fs.writeFile(
        `BP/blocks/${identifier}/${identifier}.json`,
        JSON.stringify(blockData1)
      );
      fs.writeFile(
        `BP/recipes/${identifier}/${identifier}_dye.json`,
        JSON.stringify(recipeData)
      );
      fs.writeFile(`RP/texts/en_US.lang`, langData1);
    }
    case 2: {
      var blockData2 = {
        format_version: "1.16.100",
        "minecraft:block": {
          description: {
            identifier: `ff:${identifier}_tall`,
            properties: {
              "ff:upper_bit": [0, 1],
            },
          },
          permutations: [
            {
              condition: "query.block_property('ff:upper_bit') == 0",
              components: {
                "minecraft:on_player_destroyed": {
                  event: "destroy_top",
                },
                "minecraft:pick_collision": {
                  origin: [-3.5, 0, -3.5],
                  size: [7, 16, 7],
                },
                "minecraft:loot": `loot_tables/blocks/${identifier}/${identifier}_tall.json`,
              },
            },
            {
              condition: "query.block_property('ff:upper_bit') == 1",
              components: {
                "tag:flower_top": {},
                "minecraft:material_instances": {
                  "*": {
                    render_method: "alpha_test",
                    texture: "nothing",
                    face_dimming: false,
                    ambient_occlusion: false,
                  },
                },
                "minecraft:on_player_destroyed": {
                  event: "destroy_bottom",
                },
                "minecraft:pick_collision": {
                  origin: [-3.5, 0, -3.5],
                  size: [7, 10, 7],
                },
              },
            },
          ],
          components: {
            "minecraft:loot": "loot_tables/empty.json",
            "tag:flower_bottom": {},
            "minecraft:placement_filter": {
              conditions: [
                {
                  allowed_faces: ["up"],
                  block_filter: [
                    "minecraft:grass",
                    "minecraft:dirt",
                    "minecraft:podzol",
                    "minecraft:dirt_with_roots",
                    `ff:${identifier}_tall`,
                    "moss_block",
                  ],
                },
              ],
            },
            "minecraft:geometry": "geometry.double_cross",
            "minecraft:breathability": "air",
            "tag:flower": {},
            "minecraft:breakonpush": true,
            "minecraft:material_instances": {
              "*": {
                render_method: "alpha_test",
                texture: `${identifier}_tall`,
                face_dimming: false,
                ambient_occlusion: false,
              },
            },
            "minecraft:block_light_emission": 0.14,
            "minecraft:entity_collision": false,
            "minecraft:block_light_absorption": 0,
            "minecraft:destroy_time": 0,
            "minecraft:on_interact": {
              condition: "q.get_equipped_item_name=='bone_meal'",
              event: "fertilize_block",
            },
            "minecraft:on_placed": {
              event: "check_for_bottom",
            },
          },
          events: {
            check_for_bottom: {
              sequence: [
                {
                  condition:
                    "q.block_neighbor_has_all_tags(0,-1,0,'flower_bottom')",
                  set_block_property: {
                    "ff:upper_bit": 1,
                  },
                },
                {
                  trigger: {
                    event: "add_top",
                    target: "self",
                  },
                },
              ],
            },
            add_top: {
              sequence: [
                {
                  condition: "!query.block_property('ff:upper_bit') == 1",
                  set_block_at_pos: {
                    block_offset: [0, 1, 0],
                    block_type: `ff:${identifier}_tall`,
                  },
                },
              ],
            },
            destroy_top: {
              run_command: {
                command: "fill ~ ~1 ~ ~ ~1 ~ air 0 destroy",
              },
            },
            destroy_bottom: {
              run_command: {
                command: ["fill ~ ~-1 ~ ~ ~-1 ~ air 0 destroy"],
              },
            },
            fertilize_block: {
              spawn_loot: {
                table: `loot_tables/blocks/${identifier}/${identifier}_tall.json`,
              },
              decrement_stack: {},
              run_command: {
                command: ["particle minecraft:crop_growth_emitter ~ ~ ~"],
              },
            },
          },
        },
      };
      var tallIntoShort = {
        format_version: 1.12,
        "minecraft:recipe_shapeless": {
          description: {
            identifier: `ff:tall_${identifier}_into_short_${identifier}`,
          },
          tags: ["crafting_table"],
          ingredients: [
            {
              item: `ff:${identifier}_tall_item`,
            },
          ],
          result: {
            item: `ff:${identifier}_item`,
            count: 2,
          },
        },
      };
      var shortIntoTall = {
        format_version: 1.12,
        "minecraft:recipe_shapeless": {
          description: {
            identifier: `ff:short_${identifier}_into_tall_${identifier}`,
          },
          tags: ["crafting_table"],
          ingredients: [
            {
              item: `ff:${identifier}_item`,
              count: 2,
            },
          ],
          result: {
            item: `ff:${identifier}_tall_item`,
          },
        },
      };

      fs.writeFile(
        `BP/blocks/${identifier}/${identifier}_tall.json`,
        JSON.stringify(blockData2)
      );
      fs.writeFile(
        `BP/recipes/${identifier}/tall_into_short.json`,
        JSON.stringify(tallIntoShort)
      );
      fs.writeFile(
        `BP/recipes/${identifier}/short_into_tall.json`,
        JSON.stringify(shortIntoTall)
      );
    }
    case 3: {
      var blockData3 = {
        format_version: "1.16.100",
        "minecraft:block": {
          description: {
            identifier: `ff:${identifier}_large`,
          },
          components: {
            "minecraft:pick_collision": {
              origin: [-7, 0, -7],
              size: [14, 16, 14],
            },
            "minecraft:placement_filter": {
              conditions: [
                {
                  allowed_faces: ["up"],
                  block_filter: [
                    "minecraft:grass",
                    "minecraft:dirt",
                    "minecraft:podzol",
                    "minecraft:moss_block",
                    "minecraft:dirt_with_roots",
                  ],
                },
              ],
            },
            "minecraft:geometry": "geometry.blue_bell",
            "minecraft:breathability": "air",
            "tag:flower": {},
            "minecraft:breakonpush": true,
            "minecraft:material_instances": {
              "*": {
                render_method: "alpha_test",
                texture: `${identifier}_large`,
                face_dimming: false,
                ambient_occlusion: false,
              },
            },
            "minecraft:block_light_emission": 0.14,
            "minecraft:entity_collision": false,
            "minecraft:block_light_absorption": 0,
            "minecraft:destroy_time": 0,
            "minecraft:loot": `loot_tables/blocks/${identifier}/${identifier}_large.json`,
            "minecraft:on_interact": {
              condition: "q.get_equipped_item_name=='bone_meal'",
              event: "fertilize_block",
            },
          },
          events: {
            fertilize_block: {
              spawn_loot: {
                table: `loot_tables/blocks/${identifier}/${identifier}_large.json`,
              },
              decrement_stack: {},
              run_command: {
                command: ["particle minecraft:crop_growth_emitter ~ ~ ~"],
              },
            },
          },
        },
      };
      var largeIntoTall = {
        format_version: 1.12,
        "minecraft:recipe_shapeless": {
          description: {
            identifier: `ff:large_${identifier}_into_tall_${identifier}`,
          },
          tags: ["crafting_table"],
          ingredients: [
            {
              item: `ff:${identifier}_large_item`,
            },
          ],
          result: {
            item: `ff:${identifier}_tall_item`,
            count: 2,
          },
        },
      };
      var tallIntoLarge = {
        format_version: 1.12,
        "minecraft:recipe_shapeless": {
          description: {
            identifier: `ff:tall_${identifier}_into_large_${identifier}`,
          },
          tags: ["crafting_table"],
          ingredients: [
            {
              item: `ff:${identifier}_tall_item`,
              count: 2,
            },
          ],
          result: {
            item: `ff:${identifier}_large_item`,
          },
        },
      };

      fs.writeFile(
        `BP/blocks/${identifier}/${identifier}_large.json`,
        JSON.stringify(blockData3)
      );
      fs.writeFile(
        `BP/recipes/${identifier}/large_into_tall.json`,
        JSON.stringify(largeIntoTall)
      );
      fs.writeFile(
        `BP/recipes/${identifier}/tall_into_large.json`,
        JSON.stringify(tallIntoLarge)
      );
    }
    case 4: {
      var blockData4 = {
        format_version: "1.16.100",
        "minecraft:block": {
          description: {
            identifier: `ff:${identifier}_short`,
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
                    "minecraft:dirt_with_roots",
                  ],
                },
              ],
            },
            "minecraft:loot": `loot_tables/blocks/${identifier}/${identifier}_short.json`,
            "minecraft:geometry": "geometry.cross",
            "minecraft:material_instances": {
              "*": {
                render_method: "alpha_test",
                texture: `${identifier}_short`,
                face_dimming: false,
                ambient_occlusion: false,
              },
            },
            "minecraft:entity_collision": false,
            "minecraft:block_light_absorption": 0,
            "minecraft:destroy_time": 0,
            "minecraft:breathability": "air",
            "tag:flower": {},
            "minecraft:breakonpush": true,
            "minecraft:pick_collision": {
              origin: [-3.5, 0, -3.5],
              size: [7, 10, 7],
            },
          },
          events: {},
        },
      };
      var shortIntoNormal = {
        format_version: 1.12,
        "minecraft:recipe_shapeless": {
          description: {
            identifier: `ff:short_${identifier}_into_normal_${identifier}`,
          },
          tags: ["crafting_table"],
          ingredients: [
            {
              item: `ff:${identifier}_short_item`,
            },
          ],
          result: {
            item: `ff:${identifier}_item`,
            count: 2,
          },
        },
      };
      var normalIntoShort = {
        format_version: 1.12,
        "minecraft:recipe_shapeless": {
          description: {
            identifier: `ff:normal_${identifier}_into_short_${identifier}`,
          },
          tags: ["crafting_table"],
          ingredients: [
            {
              item: `ff:${identifier}_item`,
              count: 2,
            },
          ],
          result: {
            item: `ff:${identifier}_short_item`,
          },
        },
      };
      var tallIntoShort = {
        format_version: 1.12,
        "minecraft:recipe_shapeless": {
          description: {
            identifier: `ff:tall_${identifier}_into_short_${identifier}`,
          },
          tags: ["crafting_table"],
          ingredients: [
            {
              item: `ff:${identifier}_tall_item`,
            },
          ],
          result: {
            item: `ff:${identifier}_short_item`,
            count: 2,
          },
        },
      };
      var shortIntoTall = {
        format_version: 1.12,
        "minecraft:recipe_shapeless": {
          description: {
            identifier: `ff:short_${identifier}_into_tall_${identifier}`,
          },
          tags: ["crafting_table"],
          ingredients: [
            {
              item: `ff:${identifier}_short_item`,
              count: 2,
            },
          ],
          result: {
            item: `ff:${identifier}_tall_item`,
          },
        },
      };

      fs.writeFile(
        `BP/blocks/${identifier}/${identifier}_short.json`,
        JSON.stringify(blockData4)
      );
      fs.writeFile(
        `BP/recipes/${identifier}/tall_into_short.json`,
        JSON.stringify(tallIntoShort)
      );
      fs.writeFile(
        `BP/recipes/${identifier}/short_into_tall.json`,
        JSON.stringify(shortIntoTall)
      );
      fs.writeFile(
        `BP/recipes/${identifier}/short_into_normal.json`,
        JSON.stringify(shortIntoNormal)
      );
      fs.writeFile(
        `BP/recipes/${identifier}/normal_into_short.json`,
        JSON.stringify(normalIntoShort)
      );
    }
  }
  for (let count = tier; count > 0; count--) {
    if (count === 1) {
      var type = `${identifier}`;
      var langType = `${langName}`;
    } else if (count === 2) {
      var type = `${identifier}_tall`;
      var langType = `Tall ${langName}`;
    } else if (count === 3) {
      var type = `${identifier}_large`;
      var langType = `Large ${langName}`;
    } else if (count === 4) {
      var type = `${identifier}_short`;
      var langType = `Short ${langName}`;
    }
    var lootData = {
      pools: [
        {
          rolls: 1,
          entries: [
            {
              type: "item",
              name: `ff:${type}_item`,
              weight: 1,
              functions: [
                {
                  function: "set_count",
                  count: {
                    min: 1,
                    max: 1,
                  },
                },
              ],
            },
          ],
        },
      ],
    };
    var itemData = {
      format_version: "1.16.100",
      "minecraft:item": {
        description: {
          identifier: `ff:${type}_item`,
          category: "nature",
        },
        components: {
          "minecraft:block_placer": {
            block: `ff:${type}`,
            use_on: [
              "grass",
              "dirt",
              "podzol",
              "moss_block",
              "dirt_with_roots",
            ],
          },
          "minecraft:icon": {
            texture: `${type}`,
          },
          "minecraft:creative_category": {
            parent: "itemGroup.name.flower",
          },
          "tag:flower": {},
          "minecraft:max_stack_size": 64,
          "minecraft:stacked_by_data": true,
          "minecraft:on_use_on": {
            on_use_on: {
              event: "sound",
            },
          },
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
    var featureData = {
      format_version: "1.13.0",
      "minecraft:single_block_feature": {
        description: {
          identifier: `ff:${identifier}/${type}_feature`,
        },
        places_block: {
          name: `ff:${type}`,
        },
        enforce_survivability_rules: true,
        enforce_placement_rules: true,
      },
    };
    langData += `\nitem.ff:${type}_item=${langType}`;
    blocksData[type] = { sound: "grass" };
    textureData.texture_data[type] = {
      textures: `textures/blocks/${identifier}/${type}`,
    };
    itemTextureData.texture_data[type] = {
      textures: `textures/items/${identifier}/${type}`,
    };
    fs.writeFile(
      `BP/loot_tables/blocks/${identifier}/${type}.json`,
      JSON.stringify(lootData)
    );
    fs.writeFile(
      `BP/items/${identifier}/${type}.json`,
      JSON.stringify(itemData)
    );
    fs.writeFile(
      `BP/features/${identifier}/${type}_feature.json`,
      JSON.stringify(featureData)
    );
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
}
