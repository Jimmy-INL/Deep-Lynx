/* tslint:disable */
import Logger from "../../logger";
import PostgresAdapter from "../../data_storage/adapters/postgres/postgres";
import faker from "faker";
import {expect} from "chai";
import ContainerStorage from "../../data_storage/container_storage";
import EventStorage from "../../data_storage/events/event_storage";
import { RegisteredEventT } from "../../types/events/registered_eventT";

describe('Registered Event Creation', async() => {
    var containerID:string = process.env.TEST_CONTAINER_ID || "";

    before(async function() {
        if (process.env.CORE_DB_CONNECTION_STRING === "") {
            Logger.debug("skipping registered events tests, no storage layer");
            this.skip()
        }

        await PostgresAdapter.Instance.init();
        let storage = ContainerStorage.Instance;

        let container = await storage.Create( "test suite", {"name": faker.name.findName(), "description": faker.random.alphaNumeric()});

        expect(container.isError).false;
        expect(container.value).not.empty;
        containerID = container.value[0].id!;

        return Promise.resolve()
    });


    it('can update registered event', async()=> {
        const storage = EventStorage.Instance;

        const event = await storage.Create("test suite", payload);
        expect(event.isError).false;
        expect(event.value).not.empty;

        const updateEvent = await storage.Update(event.value[0].id!, "test suite", {app_url: "yellow/flower"});
        expect(updateEvent.value).true;

        return Promise.resolve()
    });
});

const payload: RegisteredEventT = {
    "app_name": "Daisy",
    "app_url": "yellow",
    "type": "data_ingested"
};
