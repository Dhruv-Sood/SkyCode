import { createClient, commandOptions } from "redis";
import { downloadFromS3, buildProject } from "./utils";

const subscriber = createClient();
subscriber.connect()

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

        // @ts-ignore
        await buildProject(res.element);
        console.log("Build Success!!");
        
        
    }
}

main()
