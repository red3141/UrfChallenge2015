using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using CreepScoreAPI;

namespace UrfStg.Model
{
    /// <summary>
    /// Contains static champion data.
    /// </summary>
    public class Champion
    {
        /// <summary>
        /// Gets or sets the champion ID.
        /// </summary>
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long Id { get; set; }

        /// <summary>
        /// Gets or sets the champion name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the champion's title.
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the champion's lore.
        /// </summary>
        public string Lore { get; set; }

        /// <summary>
        /// Gets or sets the full-image file name.
        /// </summary>
        public string FullImage { get; set; }

        /// <summary>
        /// Gets or sets the sprite-image file name.
        /// </summary>
        public string SpriteImage { get; set; }

        /// <summary>
        /// Gets or sets the image group name.
        /// </summary>
        public string ImageGroup { get; set; }

        public Champion()
        { }

        public Champion(ChampionStatic champ)
        {
            if (champ == null)
                return;
            Id = champ.id;
            Name = champ.name;
            Title = champ.title;
            Lore = champ.lore;
            if (champ.image == null)
                return;
            FullImage = champ.image.full;
            FullImage = champ.image.sprite;
            FullImage = champ.image.group;
        }
    }
}
