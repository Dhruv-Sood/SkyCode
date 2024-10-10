import { createClient, commandOptions } from "redis";
import { downloadFromS3, buildProject, copyFinalDist } from "./utils";

const subscriber = createClient();
subscriber.connect()

const publisher = createClient();
publisher.connect();

async function main() {
    while(1){
      const res = await subscriber.brPop(
        commandOptions({ isolated: true }),
        "build-queue",
        0
      );
      console.log(res);

      // @ts-ignore
      await downloadFromS3(`output/${res.element}`);
      console.log("Downloaded");

      

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve("");
        }, 5000);
      });

      // @ts-ignore
      await buildProject(res.element);
      console.log("Build Success!!");
      // @ts-ignore

      await copyFinalDist(res.element);
      console.log("Copied to final dist");

      // @ts-ignore
      publisher.hSet("status", res.element, "deployed");
      
    }
}

main()
