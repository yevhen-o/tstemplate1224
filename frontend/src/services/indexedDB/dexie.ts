/* eslint-disable @typescript-eslint/no-explicit-any */
import Dexie, { Table } from "dexie";
import "dexie-observable";

interface LatestProjectEntry {
  organizationId: number;
  projects: string; // JSON string of project IDs
}

export type DexieChange = {
  type: number; // 1 = CREATED, 2 = UPDATED, 3 = DELETED
  table: string;
  key: any;
  obj?: any; // New object (on CREATE or UPDATE)
  oldObj?: any; // Old object (on DELETE or UPDATE)
  mods?: Record<string, any>; // Modifications (on UPDATE)
};

class OrganizationProjectsIndexDB extends Dexie {
  latestProjects!: Table<LatestProjectEntry, number>;
  private changeHandlers: Array<(changes: DexieChange[]) => void> = [];

  constructor() {
    super("OrganizationProjectsIndexDB");

    this.version(1).stores({
      latestProjects: "organizationId",
    });

    this.version(2).stores({});

    this.on("changes", (changes) => {
      this.changeHandlers.forEach((handler) => handler(changes));
    });
  }

  addChangeHandler(handler: (changes: DexieChange[]) => void) {
    this.changeHandlers.push(handler);
  }

  removeChangeHandler(handler: (changes: DexieChange[]) => void) {
    this.changeHandlers = this.changeHandlers.filter((h) => h !== handler);
  }
}

const db = new OrganizationProjectsIndexDB();

type ProjectType = { projectId: number; organizationId: number } | undefined;

/**
 * Removes a project from the latestProjects table for a specific organization.
 */
export const removeLatestProject = async (
  project: ProjectType
): Promise<number[] | undefined> => {
  if (!project) return undefined;

  const storedProjectEntry = await db.latestProjects.get(
    project.organizationId
  );

  if (storedProjectEntry) {
    const latestProjectIds: number[] = JSON.parse(storedProjectEntry.projects);
    const newValue = latestProjectIds.filter((p) => p !== project.projectId);

    await db.latestProjects.put({
      organizationId: project.organizationId,
      projects: JSON.stringify(newValue),
    });

    return newValue;
  }

  return [];
};

/**
 * Adds a project to the latestProjects table for a specific organization.
 */
export const addLatestProject = async (
  project: ProjectType
): Promise<number[] | undefined> => {
  if (!project) return undefined;

  const storedProjectEntry = await db.latestProjects.get(
    project.organizationId
  );

  let latestProjectIds: number[] = [];
  if (storedProjectEntry) {
    latestProjectIds = JSON.parse(storedProjectEntry.projects);
  }

  const newValue = latestProjectIds.includes(project.projectId)
    ? latestProjectIds
    : [...latestProjectIds, project.projectId];

  await db.latestProjects.put({
    organizationId: project.organizationId,
    projects: JSON.stringify(newValue),
  });

  return newValue;
};

export default db;

// db.on("changes", function (changes) {
//   changes.forEach(function (change) {
//     switch (change.type) {
//       case 1: // CREATED
//         console.log("An object was created: " + JSON.stringify(change.obj));
//         break;
//       case 2: // UPDATED
//         console.log(
//           "An object with key " +
//             change.key +
//             " was updated with modifications: " +
//             JSON.stringify(change.mods)
//         );
//         break;
//       case 3: // DELETED
//         console.log("An object was deleted: " + JSON.stringify(change.oldObj));
//         break;
//     }
//   });
// });
