AttackType = {
    Bullet: 0,     // Fire a bullet from the edge
    FromBottom: 1, // Raise particle up from the bottom, then lower it
    FromSide: 2,   // Swing particle across the side, e.g. Darius axe
    Still: 3,      // Particle appears in a static location
    Buff: 4        // No particle; just buff other bullets
};
LayerType = {
    Normal: 0,
    BelowAll: 1,
    AboveAll: 2
};
Effect = {
    None: 0,
    Stasis: 1,
};
FinishedAction = {
    None: 0,      // Continue moving off the screen
    Disappear: 1, // Disappear immediately
    Return: 2,    // Return to the original location
};
// These numbers line up with the team IDs from the Riot API.
Team = { 
    One: 100,
    Two: 200
};

Key = {
	Up: 0,
	Down: 1,
	Left: 2,
	Right: 3,
	Shift: 4
};