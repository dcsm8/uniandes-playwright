import { faker } from "@faker-js/faker";
import randomstring from "randomstring";

export class PageDataGenerator {
  static charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+{}[]|;:,.<>?/";

  static getRandomPageData() {
    let title = faker.lorem.words();
    let content = faker.lorem.words();

    return {
      title,
      content,
    };
  }

  static getBoundaryPageDataPlusOne() {
    const title = randomstring.generate({ length: 255 + 1, charset: this.charset });
    const content = randomstring.generate({ length: 255 + 1, charset: this.charset });

    return {
      title,
      content,
    };
  }

  static getBoundaryPageData() {
    const title = randomstring.generate({ length: 255, charset: this.charset });
    const content = randomstring.generate({ length: 255, charset: this.charset });

    return {
      title,
      content,
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