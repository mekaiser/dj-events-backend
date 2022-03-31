"use strict";
// const { sanitizeEntity } = require("strapi-utils");

/**
 *  custom controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  async me(ctx) {
    const user = ctx.state.user;

    // // User count
    // const userCount = await strapi
    //   .service("plugin::users-permissions.user")
    //   .fetchAll({});

    // console.log(userCount);

    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No authorization header was found" }] },
      ]);
    }

    const data = await strapi.entityService.findMany("api::event.event", {
      filters: { user: user.id },
      populate: "*",
    });

    if (!data) {
      return ctx.notFound();
    }

    const sanitizedEntity = await this.sanitizeOutput(data, ctx);

    return this.transformResponse(sanitizedEntity);
  },
}));
