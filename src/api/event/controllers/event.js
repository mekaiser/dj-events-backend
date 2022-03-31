"use strict";

/**
 *  event controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  // ---- Create event with linked user ----
  async create(ctx) {
    let entity;

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);

      data.user = ctx.state.user.id;

      entity = await strapi.entityService.create(
        "api::event.event",
        {
          data,
        },
        {
          files,
        }
      );
    } else {
      ctx.request.body.user = ctx.state.user.id;

      entity = await strapi.entityService.create("api::event.event", {
        data: ctx.request.body,
      });
    }
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },

  // ---- Update user event ----
  async update(ctx) {
    const { id } = ctx.params;
    const { id: userId } = ctx.state.user;

    let entity;

    const [events] = await strapi.entityService.findMany("api::event.event", {
      filters: { id, user: userId },
      populate: "*",
    });

    if (!events) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);

      entity = await strapi.entityService.update(
        "api::event.event",
        id,
        {
          data,
        },
        {
          files,
        }
      );
    } else {
      console.log("Req body Update", ctx.request.body);
      entity = await strapi.entityService.update("api::event.event", id, {
        data: ctx.request.body,
      });
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },

  // ---- Delete a user event ----
  async delete(ctx) {
    const { id } = ctx.params;
    const { id: userId } = ctx.state.user;

    const [events] = await strapi.entityService.findMany("api::event.event", {
      filters: { id, user: userId },
      populate: "*",
    });

    if (!events) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    const entity = await strapi.entityService.delete("api::event.event", id);

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },
}));
