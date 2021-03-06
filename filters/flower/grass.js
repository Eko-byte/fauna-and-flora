const fs = require("fs");
const glob = require("glob");

glob("./data/flowerFauna/grass/**/*.json", (err, filePath) => {
  filePath.forEach(v => {
    let tempData = JSON.parse(fs.readFileSync(v).toString());
    name(
      tempData.identifier,
      tempData.tier,
      tempData.langName,
      tempData.fern,
      tempData.extraTall,
      tempData.geometryNormal,
      tempData.geometryTall,
      tempData.geometryLarge,
      tempData.geometryShort,
      tempData.geometryFern,
      tempData.pickCollision,
      tempData.entityCollision,
      tempData.pickCollisionTallTop,
      tempData.entityCollisionTallTop,
      tempData.pickCollisionTallBottom,
      tempData.entityCollisionTallBottom,
      tempData.itemTextureNormal,
      tempData.ambientOcclusion,
      tempData.faceDimming,
      tempData.pickCollisionLarge,
      tempData.entityCollisionLarge,
      tempData.placement,
      tempData.placementTallBlock,
      tempData.placementTall,
      tempData.placementExtraTall,
      tempData.placementExtraTallBlock
    );
  });
});
function makeDir(path) {
  try {
    fs.mkdirSync(path, { recursive: true });
  } catch {}
}
function name(
  identifier,
  tier,
  langName,
  fern,
  extraTall,
  geometryNormal,
  geometryTall,
  geometryLarge,
  geometryShort,
  geometryFern,
  pickCollision,
  entityCollision,
  pickCollisionTallTop,
  entityCollisionTallTop,
  pickCollisionTallBottom,
  entityCollisionTallBottom,
  itemTextureNormal,
  ambientOcclusion,
  faceDimming,
  pickCollisionLarge,
  entityCollisionLarge,
  placement,
  placementTallBlock,
  placementTall,
  placementExtraTall,
  placementExtraTallBlock
) {
  let blocksData = JSON.parse(fs.readFileSync("RP/blocks.json").toString());
  let textureData = JSON.parse(
    fs.readFileSync("RP/textures/terrain_texture.json").toString()
  );
  let itemTextureData = JSON.parse(
    fs.readFileSync("RP/textures/item_texture.json").toString()
  );
  let langData = fs.readFileSync("RP/texts/en_US.lang").toString();

  makeDir(`BP/blocks/${identifier}`);
  makeDir(`BP/recipes/${identifier}`);
  makeDir(`BP/loot_tables/blocks/${identifier}`);
  makeDir(`BP/items/${identifier}`);
  makeDir(`BP/features/${identifier}`);
  makeDir(`RP/textures/blocks/${identifier}`);
  makeDir(`RP/textures/items/${identifier}`);

  if (fern) {
    var bouquetIdentifier = identifier.replace(/grass/g, "").replace(/bush/g, "") + "fern"
    var ffIdentifierFern = "ff:" + bouquetIdentifier;
    let fernBlockData = {
      format_version: "1.16.100",
      "minecraft:block": {
        description: {
          identifier: `ff:${bouquetIdentifier}`,
        },
        components: {
          "minecraft:placement_filter": {
            conditions: [
              {
                allowed_faces: ["up"],
                block_filter: placement,
              },
            ],
          },
          "minecraft:loot": `loot_tables/blocks/${identifier}/${bouquetIdentifier}.json`,
          "minecraft:geometry": geometryFern,
          "minecraft:material_instances": {
            "*": {
              render_method: "alpha_test",
              texture: `${bouquetIdentifier}`,
              face_dimming: faceDimming,
              ambient_occlusion: ambientOcclusion,
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
              table: `loot_tables/blocks/${identifier}/${bouquetIdentifier}.json`,
            },
            decrement_stack: {},
            run_command: {
              command: ["particle minecraft:crop_growth_emitter ~ ~ ~"],
            },
          },
        },
      },
    };
    let fernItemData = {
      format_version: "1.16.100",
      "minecraft:item": {
        description: {
          identifier: `ff:${bouquetIdentifier}_item`,
          category: "nature",
        },
        components: {
          "minecraft:block_placer": {
            block: `ff:${bouquetIdentifier}`,
            use_on: placement,
          },
          "minecraft:icon": { texture: `${bouquetIdentifier}` },
          "minecraft:creative_category": { parent: "itemGroup.name.grass" },
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
    let fernFeatureData = {
      format_version: "1.13.0",
      "minecraft:single_block_feature": {
        description: {
          identifier: `ff:${identifier}/${bouquetIdentifier}_feature`,
        },
        places_block: { name: `ff:${bouquetIdentifier}` },
        enforce_survivability_rules: true,
        enforce_placement_rules: true,
      },
    };
    let fernLootData = {
      pools: [
        {
          rolls: 1,
          entries: [
            {
              type: "item",
              name: `ff:${bouquetIdentifier}_item`,
              weight: 1,
              functions: [{ function: "set_count", count: { min: 1, max: 1 } }],
            },
          ],
        },
      ],
    };
    let fernRecipeData = {
      format_version: 1.12,
      "minecraft:recipe_shapeless": {
        description: {
          identifier: `ff:${identifier}_into_${bouquetIdentifier}`,
        },
        tags: ["crafting_table"],
        ingredients: [{ item: `ff:${identifier}_item`, count: 9 }],
        result: { item: `ff:${bouquetIdentifier}_item`, count: 1 },
      },
    };
    let fernRecipeData2 = {
      format_version: 1.12,
      "minecraft:recipe_shapeless": {
        description: {
          identifier: `ff:${bouquetIdentifier}_into_${identifier}`,
        },
        tags: ["crafting_table"],
        ingredients: [{ item: `ff:${bouquetIdentifier}_item`, count: 1 }],
        result: { item: `ff:${identifier}_item`, count: 9 },
      },
    };
    fs.writeFileSync(
      `BP/recipes/${identifier}/${identifier}_into_${bouquetIdentifier}.json`,
      JSON.stringify(fernRecipeData, null, "  ")
    );
    fs.writeFileSync(
      `BP/recipes/${identifier}/${bouquetIdentifier}_into_${identifier}.json`,
      JSON.stringify(fernRecipeData2, null, "  ")
    );
    fs.writeFileSync(
      `BP/blocks/${identifier}/${bouquetIdentifier}.json`,
      JSON.stringify(fernBlockData, null, "  ")
    );
    fs.writeFileSync(
      `BP/items/${identifier}/${bouquetIdentifier}.json`,
      JSON.stringify(fernItemData, null, "  ")
    );
    fs.writeFileSync(
      `BP/features/${identifier}/${bouquetIdentifier}_feature.json`,
      JSON.stringify(fernFeatureData, null, "  ")
    );
    fs.writeFileSync(
      `BP/loot_tables/blocks/${identifier}/${bouquetIdentifier}.json`,
      JSON.stringify(fernLootData, null, "  ")
    );
    bouquetLangName = langName.replace(/Grass/g, "Fern").replace(/Bush/g, "Fern")
    langData += `\nitem.ff:${bouquetIdentifier}_item=${bouquetLangName}`;
    blocksData[ffIdentifierFern] = { sound: "grass" };
    textureData.texture_data[bouquetIdentifier] = {
      textures: `textures/blocks/${identifier}/${bouquetIdentifier}`,
    };
    itemTextureData.texture_data[bouquetIdentifier] = {
      textures: `textures/items/${identifier}/${bouquetIdentifier}`,
    };
  }

  switch (tier) {
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
                  block_filter: placement,
                },
              ],
            },
            "minecraft:loot": `loot_tables/blocks/${identifier}/${identifier}_short.json`,
            "minecraft:geometry": geometryShort,
            "minecraft:material_instances": {
              "*": {
                render_method: "alpha_test",
                texture: `${identifier}_short`,
                face_dimming: faceDimming,
                ambient_occlusion: ambientOcclusion,
              },
            },
            "minecraft:entity_collision": entityCollision,
            "minecraft:block_light_absorption": 0,
            "minecraft:destroy_time": 0,
            "minecraft:breathability": "air",
            "tag:flower": {},
            "minecraft:breakonpush": true,
            "minecraft:pick_collision": pickCollision,
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

      fs.writeFileSync(
        `BP/blocks/${identifier}/${identifier}_short.json`,
        JSON.stringify(blockData4)
      );
      fs.writeFileSync(
        `BP/recipes/${identifier}/tall_into_short.json`,
        JSON.stringify(tallIntoShort)
      );
      fs.writeFileSync(
        `BP/recipes/${identifier}/short_into_tall.json`,
        JSON.stringify(shortIntoTall)
      );
      fs.writeFileSync(
        `BP/recipes/${identifier}/short_into_normal.json`,
        JSON.stringify(shortIntoNormal)
      );
      fs.writeFileSync(
        `BP/recipes/${identifier}/normal_into_short.json`,
        JSON.stringify(normalIntoShort)
      );
    }
    case 3: {
      if (!extraTall) {
        var blockData3 = {
          format_version: "1.16.100",
          "minecraft:block": {
            description: {
              identifier: `ff:${identifier}_large`,
            },
            components: {
              "minecraft:pick_collision": pickCollisionLarge,
              "minecraft:placement_filter": {
                conditions: [
                  {
                    allowed_faces: ["up"],
                    block_filter: placement,
                  },
                ],
              },
              "minecraft:geometry": geometryLarge,
              "minecraft:breathability": "air",
              "tag:flower": {},
              "minecraft:breakonpush": true,
              "minecraft:material_instances": {
                "*": {
                  render_method: "alpha_test",
                  texture: `${identifier}_large`,
                  face_dimming: faceDimming,
                  ambient_occlusion: ambientOcclusion,
                },
              },
              "minecraft:block_light_emission": 0.14,
              "minecraft:entity_collision": entityCollisionLarge,
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
      } else {
        var blockData3 = {
          "format_version": "1.16.100",
          "minecraft:block": {
            "description": {
              "identifier": `ff:${identifier}_large`,
              "properties": {
                "ff:upper_bit": [
                  0,
                  1,
                  2
                ]
              }
            },
            "permutations": [
              {
                "condition": "query.block_property('ff:upper_bit') == 0",
                "components": {
                  "tag:flower_bottom": {},
                  "minecraft:pick_collision": {
                    "origin": [
                      -3.5,
                      0,
                      -3.5
                    ],
                    "size": [
                      7,
                      16,
                      7
                    ]
                  },
                  "minecraft:loot": `loot_tables/blocks/${identifier}/${identifier}_large.json`
                }
              },
              {
                "condition": "query.block_property('ff:upper_bit') == 1",
                "components": {
                  "tag:flower_middle": {},
                  "minecraft:material_instances": {
                    "*": {
                      "render_method": "alpha_test",
                      "texture": "nothing",
                      "face_dimming": false,
                      "ambient_occlusion": false
                    }
                  },
                  "minecraft:on_player_destroyed": {
                    "event": "destroy_middle"
                  },
                  "minecraft:pick_collision": {
                    "origin": [
                      -3.5,
                      0,
                      -3.5
                    ],
                    "size": [
                      7,
                      16,
                      7
                    ]
                  }
                }
              },
              {
                "condition": "query.block_property('ff:upper_bit') == 2",
                "components": {
                  "tag:flower_top": {},
                  "minecraft:material_instances": {
                    "*": {
                      "render_method": "alpha_test",
                      "texture": "nothing",
                      "face_dimming": false,
                      "ambient_occlusion": false
                    }
                  },
                  "minecraft:on_player_destroyed": {
                    "event": "destroy_top"
                  },
                  "minecraft:pick_collision": {
                    "origin": [
                      -3.5,
                      0,
                      -3.5
                    ],
                    "size": [
                      7,
                      10,
                      7
                    ]
                  }
                }
              }
            ],
            "components": {
              "minecraft:loot": "loot_tables/empty.json",
              "minecraft:placement_filter": {
                "conditions": [
                  {
                    "allowed_faces": [
                      "up"
                    ],
                    "block_filter": placementExtraTallBlock
                  }
                ]
              },
              "minecraft:geometry": geometryLarge,
              "minecraft:breathability": "air",
              "tag:flower": {},
              "minecraft:breakonpush": true,
              "minecraft:material_instances": {
                "*": {
                  "render_method": "alpha_test",
                  "texture": `${identifier}_large`,
                  "face_dimming": false,
                  "ambient_occlusion": false
                }
              },
              "minecraft:block_light_emission": 0.14,
              "minecraft:entity_collision": false,
              "minecraft:block_light_absorption": 0,
              "minecraft:destroy_time": 0,
              "minecraft:on_interact": {
                "condition": "q.get_equipped_item_name=='bone_meal'",
                "event": "fertilize_block"
              },
              "minecraft:on_placed": {
                "event": "check_for_bottom"
              }
            },
            "events": {
              "check_for_bottom": {
                "sequence": [
                  {
                    "trigger": {
                      "event": "add_middle",
                      "target": "self"
                    }
                  },
                  {
                    "trigger": {
                      "event": "add_top",
                      "target": "self"
                    }
                  },
                  {
                    "condition": "q.block_neighbor_has_all_tags(0,-1,0,'flower_bottom')",
                    "set_block_property": {
                      "ff:upper_bit": 1
                    }
                  },
                  {
                    "condition": "q.block_neighbor_has_all_tags(0,-1,0,'flower_middle')",
                    "set_block_property": {
                      "ff:upper_bit": 2
                    }
                  }
                ]
              },
              "add_middle": {
                "sequence": [
                  {
                    "condition": "query.block_property('ff:upper_bit') == 0",
                    "set_block_at_pos": {
                      "block_offset": [
                        0,
                        1,
                        0
                      ],
                      "block_type": `ff:${identifier}_large`
                    }
                  }
                ]
              },
              "add_top": {
                "sequence": [
                  {
                    "condition": "query.block_property('ff:upper_bit') == 0",
                    "set_block_at_pos": {
                      "block_offset": [
                        0,
                        2,
                        0
                      ],
                      "block_type": `ff:${identifier}_large`
                    }
                  }
                ]
              },
              "destroy_top": {
                "run_command": {
                  "command": [
                    "fill ~ ~-1 ~ ~ ~-1 ~ air 0",
                    "fill ~ ~-2 ~ ~ ~-2 ~ air 0 destroy"
                  ]
                }
              },
              "destroy_middle": {
                "run_command": {
                  "command": [
                    "fill ~ ~-1 ~ ~ ~-1 ~ air 0 destroy",
                    "fill ~ ~1 ~ ~ ~1 ~ air 0"
                  ]
                }
              },
              "fertilize_block": {
                "spawn_loot": {
                  "table": `loot_tables/blocks/${identifier}/${identifier}_large.json`
                },
                "decrement_stack": {},
                "run_command": {
                  "command": [
                    "particle minecraft:crop_growth_emitter ~ ~ ~"
                  ]
                }
              }
            }
          }
        }
      }
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

      fs.writeFileSync(
        `BP/blocks/${identifier}/${identifier}_large.json`,
        JSON.stringify(blockData3)
      );
      fs.writeFileSync(
        `BP/recipes/${identifier}/large_into_tall.json`,
        JSON.stringify(largeIntoTall)
      );
      fs.writeFileSync(
        `BP/recipes/${identifier}/tall_into_large.json`,
        JSON.stringify(tallIntoLarge)
      );
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
                "minecraft:pick_collision": pickCollisionTallBottom,
                "minecraft:entity_collision": entityCollisionTallBottom,
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
                    face_dimming: faceDimming,
                    ambient_occlusion: ambientOcclusion,
                  },
                },
                "minecraft:on_player_destroyed": {
                  event: "destroy_bottom",
                },
                "minecraft:pick_collision": pickCollisionTallTop,
                "minecraft:entity_collision": entityCollisionTallTop,
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
                  block_filter: placementTallBlock,
                },
              ],
            },
            "minecraft:geometry": geometryTall,
            "minecraft:breathability": "air",
            "tag:flower": {},
            "minecraft:breakonpush": true,
            "minecraft:material_instances": {
              "*": {
                render_method: "alpha_test",
                texture: `${identifier}_tall`,
                face_dimming: faceDimming,
                ambient_occlusion: ambientOcclusion,
              },
            },
            "minecraft:block_light_emission": 0.14,
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

      fs.writeFileSync(
        `BP/blocks/${identifier}/${identifier}_tall.json`,
        JSON.stringify(blockData2)
      );
      fs.writeFileSync(
        `BP/recipes/${identifier}/tall_into_short.json`,
        JSON.stringify(tallIntoShort)
      );
      fs.writeFileSync(
        `BP/recipes/${identifier}/short_into_tall.json`,
        JSON.stringify(shortIntoTall)
      );
    }
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
                  block_filter: placement,
                },
              ],
            },
            "minecraft:loot": `loot_tables/blocks/${identifier}/${identifier}.json`,
            "minecraft:geometry": geometryNormal,
            "minecraft:material_instances": {
              "*": {
                render_method: "alpha_test",
                texture: `${identifier}`,
                face_dimming: faceDimming,
                ambient_occlusion: ambientOcclusion,
              },
            },
            "minecraft:entity_collision": entityCollision,
            "minecraft:block_light_absorption": 0,
            "minecraft:destroy_time": 0,
            "minecraft:breathability": "air",
            "tag:flower": {},
            "minecraft:breakonpush": true,
            "minecraft:pick_collision": pickCollision,
          },
          events: {},
        },
      };

      fs.writeFileSync(
        `BP/blocks/${identifier}/${identifier}.json`,
        JSON.stringify(blockData1)
      );
    }
  }
  for (let count = tier; count > 0; count--) {
    if (count === 1) {
      var type = `${identifier}`;
      var blockJSON = `ff:${identifier}`
      var langType = `${langName}`;
      if (itemTextureNormal) {
        var folder = "items";
      } else if (!itemTextureNormal) {
        var folder = "blocks";
      }
    } else if (count === 2) {
      var blockJSON = `ff:${identifier}_tall`
      var type = `${identifier}_tall`;
      var langType = `Tall ${langName}`;
      var folder = "items";
      var placement = placementTall
    } else if (count === 3) {
      var blockJSON = `ff:${identifier}_large`
      var type = `${identifier}_large`;
      var langType = `Large ${langName}`;
      var folder = "items";
    } else if (count === 4) {
      var blockJSON = `ff:${identifier}_short`
      var type = `${identifier}_short`;
      var langType = `Short ${langName}`;
      if (itemTextureNormal) {
        var folder = "items";
      } else if (!itemTextureNormal) {
        var folder = "blocks";
      }
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
            use_on: placement,
          },
          "minecraft:icon": {
            texture: `${type}`,
          },
          "minecraft:creative_category": {
            parent: "itemGroup.name.grass",
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
    blocksData[blockJSON] = { sound: "grass" };
    textureData.texture_data[type] = {
      textures: `textures/blocks/${identifier}/${type}`,
    };
    itemTextureData.texture_data[type] = {
      textures: `textures/${folder}/${identifier}/${type}`,
    };
    fs.writeFileSync(
      `BP/loot_tables/blocks/${identifier}/${type}.json`,
      JSON.stringify(lootData)
    );
    fs.writeFileSync(
      `BP/items/${identifier}/${type}.json`,
      JSON.stringify(itemData)
    );
    fs.writeFileSync(
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
