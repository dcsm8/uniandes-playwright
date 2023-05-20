import { faker } from "@faker-js/faker";

export class TagDataGenerator {
  static getRandomPostData() {
    return {
      title: faker.internet.userName(),
      content: faker.internet.userName(),
    };
  }

  static getBoundaryPostDataPlusOne() {
    return {
      title: "".repeat(2001),
      content: "Contenido valido",
    };
  }

  static getBoundaryPostData() {
    return {
      title: "".repeat(2000),
      content: "Contenido valido",
    };
  }

  static getValidStaffName() {
    return "ghost";
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
