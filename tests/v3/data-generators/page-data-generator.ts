import { faker } from "@faker-js/faker";

export class PageDataGenerator {
  static getRandomPageData() {
    return {
      title: faker.internet.userName(),
      content: faker.internet.userName(),
    };
  }

  static getBoundaryPageDataPlusOne() {
    return {
      title: "".repeat(2001),
      content: "Valid content",
    };
  }

  static getBoundaryPageData() {
    return {
      title: "".repeat(2000),
      content: "Valid content",
    };
  }

  static getValidPageData() {
    return {
      title: "New page title",
      content: "New page content",
    };
  }

  static getValidUpdatedPageData() {
    return {
      title: "Updated page title",
      content: "Updated page content",
    };
  }
}
