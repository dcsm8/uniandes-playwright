import { faker } from "@faker-js/faker";

export class TagDataGenerator {
  static getRandomTagData() {
    return {
      name: faker.internet.userName(),
      description: faker.lorem.sentence(),
    };
  }

  static getBoundaryTagDataPlusOne() {
    return {
      title: "".repeat(2001),
      content: "Contenido valido",
    };
  }

  static getBoundaryTagData() {
    return {
      title: "".repeat(2000),
      content: "Contenido valido",
    };
  }

  static getValidTagData() {
    return {
      name: "New tag title",
      description: "New tag content",
    };
  }

  static getValidUpdatedTagData() {
    return {
      name: "Updated tag title",
      description: "Updated tag content",
    };
  }
}
