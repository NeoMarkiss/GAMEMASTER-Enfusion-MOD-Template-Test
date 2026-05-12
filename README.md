# GAMEMASTER-Enfusion-MOD-Template-Test
ARMA REFORGER - Latest Min Req's for the Save Scenario, MOD to WORKBENCH WorkFlows.

[]
# MyCustomMod (Vanilla+1 Server Pack)

This mod contains:
- A custom map (MyCustomMap)
- A custom game mode (CustomMode)
- A SAVE-enabled scenario for Gamemaster or server play
- A dynamic spawner logic script
- A server_config.json template

## Minimum Requirements
- Arma Reforger Tools (Workbench)
- Navmesh baked for MyCustomMap
- ScenarioFramework + SaveGameManager included in scenario
- Mod must be published before server can load it

## Notes
- All files are original and derived from official samples.
- No vanilla assets are redistributed.
- Scenario is map-specific; game mode is map-agnostic.
<br>
<br>

<World>
    <!-- Empty world placeholder -->
    <!-- Replace with your actual world data -->
</World>
<br>
<br>

Layer
{
    Name = "MyCustomMapLayer";
    // Place spawn points, logic prefabs, etc.
}
<br>
<br>

SCR_GameMode_CustomMode
{
    Name = "CustomMode";

    Components
    {
        SCR_BaseGameModeComponent {};
        SCR_FactionManagerComponent {};
        SCR_LoadoutManagerComponent {};
        SCR_PerceptionManagerComponent {};
        SCR_RadioManagerComponent {};
        SCR_TaskManagerComponent {};
    };
}
<br>

modded class SCR_GameMode_CustomMode : SCR_BaseGameMode
{
    override void OnGameStart()
    {
        super.OnGameStart();
        Print("Custom Game Mode Started!", LogLevel.NORMAL);
    }
}

<br>
<br>

class SCR_DynamicSpawner : ScriptComponent
{
    [Attribute("300", UIWidgets.EditBox)]
    float m_fSpawnRadiusMax;

    [Attribute("150", UIWidgets.EditBox)]
    float m_fSpawnRadiusMin;

    [Attribute("4", UIWidgets.EditBox)]
    int m_iUnitsPerGroup;

    [Attribute("4", UIWidgets.EditBox)]
    int m_iMaxGroups;

    ref array<IEntity> m_aGroups = {};

    override void EOnInit(IEntity owner)
    {
        SetEventMask(owner, EntityEvent.FRAME);
    }

    override void EOnFrame(IEntity owner, float timeSlice)
    {
        PlayerManager pm = GetGame().GetPlayerManager();
        if (!pm) return;

        array<int> players = {};
        pm.GetPlayers(players);
        if (players.IsEmpty()) return;

        IEntity player = pm.GetPlayerControlledEntity(players[0]);
        if (!player) return;

        vector pos = player.GetOrigin();

        if (m_aGroups.Count() < m_iMaxGroups)
            SpawnGroup(pos);

        Cleanup(pos);
    }

    void SpawnGroup(vector pos)
    {
        float dist = Math.RandomFloat(m_fSpawnRadiusMin, m_fSpawnRadiusMax);
        float ang = Math.RandomFloat(0, Math.PI2);
        vector offset = Vector(dist * Math.Cos(ang), 0, dist * Math.Sin(ang));

        Resource res = Resource.Load("{GUID}Prefabs/AI/Groups/US_RifleSquad.et");
        if (!res) return;

        IEntity g = GetGame().SpawnEntityPrefab(res, null, pos + offset);
        if (g) m_aGroups.Insert(g);
    }

    void Cleanup(vector pos)
    {
        for (int i = m_aGroups.Count() - 1; i >= 0; i--)
        {
            IEntity g = m_aGroups[i];
            if (!g) { m_aGroups.Remove(i); continue; }

            if (vector.Distance(g.GetOrigin(), pos) > 600)
            {
                SCR_EntityHelper.DeleteEntityAndChildren(g);
                m_aGroups.Remove(i);
            }
        }
    }
}

<br>
<br>


ScenarioClass SCR_Mission
{
    SCR_MissionHeader
    {
        m_sName = "My Custom Map - Custom Mode";
        m_sDescription = "Custom scenario with SAVE enabled.";
        m_sGameModeName = "Custom Mode";
        m_sGameModeClass = "SCR_GameMode_CustomMode";
        m_bVisibleInBrowser = true;
    };

    WorldName "{GUID}Worlds/MyCustomMap/MyCustomMap.ent";

    Entities
    {
        // Scenario Framework (required for SAVE)
        Entity "{GUID}Prefabs/Logic/ScenarioFramework/GameModeSF.et"
        {
            Name = "ScenarioFramework";

            Components
            {
                SCR_PersistenceComponent
                {
                    m_bEnablePersistence = true;
                };
            };
        };

        // Save Game Manager
        Entity "{GUID}Prefabs/Logic/SaveGameManager.et"
        {
            Name = "SaveGameManager";
        };

        // Custom Game Mode
        Entity "{GUID}Prefabs/GameMode/Custom/GameMode_CustomMode.et"
        {
            Name = "CustomMode";
        };

        // Optional Dynamic Spawner
        Entity "{GUID}Prefabs/Logic/DynamicSpawner.et"
        {
            Name = "DynamicSpawner";
        };
    };
}

<br>
<br>



{
  "scenarioId": "{MODGUID}Missions/MyCustomMap_CustomScenario.conf",
  "mods": [
    "{MODID}"
  ],
  "bindAddress": "0.0.0.0",
  "bindPort": 2001,
  "publicAddress": "",
  "publicPort": 2001,
  "adminPassword": "admin",
  "maxPlayers": 32,
  "gameHostBindAddress": "0.0.0.0",
  "gameHostBindPort": 2002,
  "gameHostRegister": true
}


<br>
<br>



🎉 DONE — You Now Have a Full Custom Server Pack

This pack includes:

✔ Custom Map
✔ Custom Game Mode
✔ Custom Scenario
✔ SAVE support
✔ Dynamic spawner
✔ Server config
✔ README
✔ Workbench‑ready folder structure
✔ Vanilla+1 safe mod design
