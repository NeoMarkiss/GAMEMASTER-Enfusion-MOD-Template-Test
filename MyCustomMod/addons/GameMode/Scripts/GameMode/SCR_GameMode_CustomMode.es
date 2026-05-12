modded class SCR_GameMode_CustomMode : SCR_BaseGameMode
{
    override void OnGameStart()
    {
        super.OnGameStart();
        Print("Custom Game Mode Started!", LogLevel.NORMAL);
    }
}
