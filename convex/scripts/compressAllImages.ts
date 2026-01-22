import { internalMutation } from "../_generated/server";
import { api } from "../_generated/api";

export const compressAllExistingImages = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("🚀 Starting image compression for all existing medias...");

    let totalImages = 0;
    let processedImages = 0;
    const compressionPromises: Promise<void>[] = [];

    // Helper function to process medias
    const processMedias = async (
      medias: Array<{ url: string; type: "image" }> | undefined,
      source: string
    ) => {
      if (!medias || medias.length === 0) return;

      for (const media of medias) {
        if (media.type === "image") {
          totalImages++;
          console.log(`[${source}] Queueing compression for: ${media.url}`);

          // Extract userId from URL (e.g., https://pub-xxx.r2.dev/userId/image.jpg)
          //   const urlParts = new URL(media.url).pathname.split("/");
          //   const userIdFromUrl = urlParts[1]; // userId is the first segment after domain

          // Schedule compression action (don't await immediately)
          compressionPromises.push(
            ctx.scheduler
              .runAfter(0, api.utils.images.compressImage, {
                publicUrl: media.url,
                // userId: userIdFromUrl,
              })
              .then(() => {
                processedImages++;
                console.log(
                  `[${source}] Compressed ${processedImages}/${totalImages}`
                );
              })
              .catch((err) => {
                console.error(
                  `[${source}] Failed to compress ${media.url}:`,
                  err
                );
              })
          );
        }
      }
    };

    // Process moments
    console.log("📸 Processing moments...");
    const moments = await ctx.db.query("moments").collect();
    for (const moment of moments) {
      await processMedias(moment.medias, `Moment ${moment._id}`);
    }
    console.log(`✅ Moments: ${moments.length} items checked`);

    // Process persons
    console.log("👤 Processing persons...");
    const persons = await ctx.db.query("persons").collect();
    for (const person of persons) {
      await processMedias(person.medias, `Person ${person._id}`);
    }
    console.log(`✅ Persons: ${persons.length} items checked`);

    // Process places
    console.log("📍 Processing places...");
    const places = await ctx.db.query("places").collect();
    for (const place of places) {
      await processMedias(place.medias, `Place ${place._id}`);
    }
    console.log(`✅ Places: ${places.length} items checked`);

    // Process things
    console.log("🎁 Processing things...");
    const things = await ctx.db.query("things").collect();
    for (const thing of things) {
      await processMedias(thing.medias, `Thing ${thing._id}`);
    }
    console.log(`✅ Things: ${things.length} items checked`);

    // Process users
    console.log("👥 Processing users...");
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      await processMedias(user.medias, `User ${user._id}`);
    }
    console.log(`✅ Users: ${users.length} items checked`);

    // Wait for all compressions to be scheduled
    // Note: The actual compression happens asynchronously via scheduler
    console.log(`\n📊 Summary:`);
    console.log(`   Total images found: ${totalImages}`);
    console.log(`   Compressions queued: ${compressionPromises.length}`);
    console.log(`\n⏳ Compressions are running in the background...`);
    console.log(`   Check the logs to monitor progress.`);

    return {
      totalImages,
      queued: compressionPromises.length,
    };
  },
});
