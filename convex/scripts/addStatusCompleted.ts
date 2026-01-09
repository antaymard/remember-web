import { internalMutation } from "../_generated/server";

export const addStatusToAll = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log(
      "🚀 Starting migration: adding status='completed' to all items..."
    );

    // Migrate moments
    const moments = await ctx.db.query("moments").collect();
    let momentsUpdated = 0;
    for (const moment of moments) {
      if (!moment.status) {
        await ctx.db.patch(moment._id, { status: "completed" });
        momentsUpdated++;
      }
    }
    console.log(
      `✅ Moments: ${momentsUpdated} updated (${moments.length} total)`
    );

    // Migrate persons
    const persons = await ctx.db.query("persons").collect();
    let personsUpdated = 0;
    for (const person of persons) {
      if (!person.status) {
        await ctx.db.patch(person._id, { status: "completed" });
        personsUpdated++;
      }
    }
    console.log(
      `✅ Persons: ${personsUpdated} updated (${persons.length} total)`
    );

    // Migrate things
    const things = await ctx.db.query("things").collect();
    let thingsUpdated = 0;
    for (const thing of things) {
      if (!thing.status) {
        await ctx.db.patch(thing._id, { status: "completed" });
        thingsUpdated++;
      }
    }
    console.log(`✅ Things: ${thingsUpdated} updated (${things.length} total)`);

    // Migrate places
    const places = await ctx.db.query("places").collect();
    let placesUpdated = 0;
    for (const place of places) {
      if (!place.status) {
        await ctx.db.patch(place._id, { status: "completed" });
        placesUpdated++;
      }
    }
    console.log(`✅ Places: ${placesUpdated} updated (${places.length} total)`);

    const totalUpdated =
      momentsUpdated + personsUpdated + thingsUpdated + placesUpdated;
    const totalItems =
      moments.length + persons.length + things.length + places.length;

    console.log(`\n🎉 Migration completed!`);
    console.log(
      `   Total: ${totalUpdated} items updated out of ${totalItems} items`
    );

    return {
      moments: { updated: momentsUpdated, total: moments.length },
      persons: { updated: personsUpdated, total: persons.length },
      things: { updated: thingsUpdated, total: things.length },
      places: { updated: placesUpdated, total: places.length },
      totalUpdated,
      totalItems,
    };
  },
});
