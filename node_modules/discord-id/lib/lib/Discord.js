"use strict";
/**
 * @author Jinzulen
 * @license Apache 2.0
 * @copyright Copyright 2021 Khalil G. <https://github.com/Jinzulen>
 */
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const Flags_1 = require("./Flags");
class DiscordAPI {
    constructor(botKey) {
        /**
         * @param Headers object
         *
         * Request Headers.
         */
        this.Headers = {
            "User-Agent": "Jinzulen/DiscordID"
        };
        /**
         * @param Gateway string
         *
         * Discord API Endpoint.
         */
        this.Gateway = "https://discord.com/api/users";
        /**
         * Instantiate Flags.
         */
        this.Flags = new Flags_1.Flags;
        /**
         * Add the bot token to
         * the authorization header.
         *
         * AUTHENTICATION REFERENCE: https://discord.com/developers/docs/reference#authentication
         */
        this.Headers["Authorization"] = `Bot ${botKey}`;
    }
    /**
     * Grab the user's profile.
     *
     * @param userId string
     *
     * @returns Promise
     */
    grabProfile(userId) {
        try {
            return new Promise((resolve, reject) => {
                node_fetch_1.default(`${this.Gateway}/${userId}`, {
                    method: "GET",
                    headers: this.Headers
                }).then(Data => Data.json()).then(JSON => {
                    if (JSON.code) {
                        return reject(JSON);
                    }
                    JSON["creation_stamp"] = this.grabUnix(JSON.id);
                    JSON["avatar"] = this.grabAvatar(JSON.id, JSON.avatar);
                    JSON["badges"] = this.Flags.deconstructFlags(JSON.public_flags);
                    return resolve(JSON);
                });
            });
        }
        catch (Exception) {
            throw Exception.message;
        }
    }
    /**
     * Grab account
     * creation timestamp.
     *
     * USER ID (SNOWFLAKE) / 2 ^ 22 + DISCORD EPOCH
     * SNOWFLAKES REFERENCE: https://discord.com/developers/docs/reference#snowflakes
     *
     * @param userId
     *
     * @returns number
     */
    grabUnix(userId) {
        return Number(userId) / 4194304 + 1420070400000;
    }
    /**
     * Add to the raw
     * avatar data.
     *
     * @param userID string
     * @param avatarHash string
     *
     * @returns object
     */
    grabAvatar(userId, avatarHash) {
        let Format = avatarHash.startsWith("a_") ? "gif" : "png";
        return {
            "hash": avatarHash,
            "format": Format,
            "url": `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${Format}?size=1024`
        };
    }
}
exports.default = DiscordAPI;
;
