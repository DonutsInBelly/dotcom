import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";

import { MongoClient } from "mongodb";

export default function CommandPage({ commands }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Command Name</TableCell>
          <TableCell>Command Response</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {commands.map((row, index) => {
          return (
            <TableRow key={"command" + index}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.response}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export async function getServerSideProps() {
  try {
    const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@twitchbot.ljjwk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    let commands = [];
    const collection = await client.db("Commands").collection("custom");
    await collection
      .find({}, { name: 1, response: 1, id: 0, _id: 0 })
      .forEach((element) => {
        commands.push({
          name: element.name,
          response: element.response,
        });
      });

    // console.log(await commands.toArray());
    return {
      props: {
        commands: commands,
      },
    };
  } catch (e) {
    console.log(e);
  }
}
