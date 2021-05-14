import Head from "next/head";
import styles from "../styles/Home.module.css";
import styled from "styled-components";
import { table } from "./api/airtable";
import Link from "next/link";

export default function Posts({ airtableRecords }) {
  console.log(airtableRecords);
  console.table(airtableRecords);
  return (
    <div className={styles.container}>
      <Head>
        <title>products from Airtable</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Products</h1>
        <div>
          {airtableRecords.map(
            (record) =>
              record.fields.Status && (
                <div
                  style={{ margin: 10, padding: 10, border: "solid 1px gray" }}
                  key={record.id}
                >
                  <h2>
                    <Link href={"/products/" + record.fields.code.text}>
                      <a>{record.fields.name}</a>
                    </Link>
                  </h2>
                  <p>{record.fields.Status}</p>
                  <p>{record.fields.code.text}</p>
                  <h3>${record.fields.fullPrice}</h3>
                  <p>{record.fields.notes}</p>
                  <Pictures>
                    {record.fields.photos.map((photo) => (
                      <a key={photo.url} href={photo.url}>
                        <img src={photo.url} alt={record.fields.name} />
                      </a>
                    ))}
                  </Pictures>
                </div>
              )
          )}
        </div>
      </main>
    </div>
  );
}

const Pictures = styled.div`
  display: flex;
  img {
    width: 33%;
  }
`;

export async function getStaticProps(context) {
  let airtableRecords = await table
    .select({
      maxRecords: 10,
      sort: [{ field: "code", direction: "asc" }],
    })
    .firstPage();
  airtableRecords = airtableRecords.map((record) => {
    return {
      id: record.id,
      fields: record.fields,
    };
  });
  return {
    props: {
      airtableRecords: airtableRecords,
    },
  };
}
