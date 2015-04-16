AttackType = {
    Bullet: 0,     // Fire a bullet from the edge
    FromBottom: 1, // Raise particle up from the bottom, then lower it
    FromSide: 2,   // Poke a paricle our from the side, then retract it
    Swing: 3,      // Swing particle across the side, e.g. Darius axe
    Still: 4,      // Particle appears in a static location
    GlobalFocus: 5,// No particle; make all bullets on the current half of the
                   // screen focus the player
    IncreaseTransparency: 6, // Increase the transparency of existing attacks
    AcrossEdge: 7, // Slide across one of the edges
};
LayerType = {
    Normal: 0,
    BelowAll: 1,
    AboveAll: 2,
    Darkness: 3,
};
Effect = {
    None: 0,
    Stasis: 1,
};
SpawnAfter = {
    Nothing: 0,   // Spawn immediately
    Previous: 1,  // Spawn after the previous attack is "finished"
};
SpawnFrom = {
    Edge: 0,      // Spawn from the edge of the screen
    Target: 1,    // Spawn at the target point
};
FinishedAction = {
    None: 0,      // Continue moving off the screen
    Disappear: 1, // Disappear immediately
    Return: 2,    // Return to the original location
    Fade: 3,      // Fade out
};
// These numbers line up with the team IDs from the Riot API.
Team = { 
    One: 100,
    Two: 200
};

GameState = {
    Playing: 0,
    Tutorial: 1,
    Ended: 2,
};