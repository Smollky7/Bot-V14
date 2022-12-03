"use strict";
/**
 * @author Jinzulen
 * @license Apache 2.0
 * @copyright Copyright 2021 Khalil G. <https://github.com/Jinzulen>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flags = void 0;
;
class Flags {
    constructor() {
        /**
         * @param Flags object
         *
         * Discord's public flags' definitions.
         *
         * REFERENCE: https://discord.com/developers/docs/resources/user#user-object-user-flags
         */
        this.Flags = {
            "Discord Employee": 1 << 0,
            "Partnered Server Owner": 1 << 1,
            "HypeSquad Events": 1 << 2,
            "Bug Hunter Level 1": 1 << 3,
            "House Bravery": 1 << 6,
            "House Brilliance": 1 << 7,
            "House Balance": 1 << 8,
            "Early Supporter": 1 << 9,
            "Team User": 1 << 10,
            "Bug Hunter Level 2": 1 << 14,
            "Verified Bot": 1 << 16,
            "Early Verified Bot Developer": 1 << 17
        };
        /**
         * @param Badges object
         *
         * User badges store.
         */
        this.Badges = [];
    }
    /**
     * @param publicFlags number
     *
     * Grab the user's profile badges.
     *
     * @returns Array
     */
    deconstructFlags(publicFlags) {
        /**
         * This user has no badges.
         */
        if (publicFlags == 0) {
            this.Badges.push({
                "id": 0,
                "name": "None"
            });
        }
        for (var Flag in this.Flags) {
            if (publicFlags & this.Flags[Flag]) {
                this.Badges.push({
                    "id": this.Flags[Flag],
                    "name": Flag
                });
            }
        }
        return this.Badges;
    }
}
exports.Flags = Flags;
;
