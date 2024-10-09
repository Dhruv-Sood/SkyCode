import { createClient, commandOptions } from "redis";
import { downloadFromS3 } from "./utils";

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
        downloadFromS3(`output/${res.element}`);
        
    }
}

main()
