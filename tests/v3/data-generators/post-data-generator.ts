import { faker } from "@faker-js/faker";

export class PostDataGenerator {
  static getRandomPostData() {
    let title = faker.lorem.words();
    let content = faker.lorem.words();

    return {
      title,
      content,
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

  static getValidPostData() {
    return {
      title: "New title",
      content: "New content",
    };
  }

  static getValidUpdatedPostData() {
    return {
      title: "Updated title",
      content: "Updated content",
    };
  }
}
