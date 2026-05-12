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
