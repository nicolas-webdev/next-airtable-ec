import Head from "next/head";
import styles from "../../styles/Home.module.css";
import styled from "styled-components";
import { table } from "../api/airtable";

export default function Posts({ airtableRecords, slug }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{airtableRecords[0].fields.name}</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>{airtableRecords[0].fields.name}</h1>
        <div>
          {airtableRecords.map(
            (record) =>
              record.fields.Status && (
                <div
                  style={{ margin: 10, padding: 10, border: "solid 1px gray" }}
                  key={record.id}
                >
                  <h2>{record.fields.name}</h2>
                  <p>{record.fields.Status}</p>
                  <p>{record.fields.code.text}</p>
                  <h3>${record.fields.fullPrice}</h3>
                  <p>{record.fields.notes}</p>
                  <Pictures>
                    {record.fields.photos.map((photo) => (
                      <img
                        key={photo.url}
                        src={photo.url}
                        alt={record.fields.name}
                      />
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
    width: 20%;
  }
`;

export async function getStaticPaths() {
  let airtableRecords = await table
    .select({
      maxRecords: 10,
      sort: [{ field: "code", direction: "asc" }],
    })
    .firstPage();

  airtableRecords = airtableRecords.map((record) => ({
    id: record.id,
    fields: record.fields,
  }));

  const paths = airtableRecords.map(
    (record) => "/products/" + record.fields.code.text
  );
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
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
  airtableRecords = airtableRecords.filter(
    (record) => record.fields.code.text === params.product
  );
  return {
    props: {
      airtableRecords: airtableRecords,
      slug: params.product,
    },
  };
}
