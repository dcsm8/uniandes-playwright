import { faker } from "@faker-js/faker";
import randomstring from "randomstring";

export class TagDataGenerator {
  static charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+{}[]|;:,.<>?/";

  static getRandomTagData() {
    let name = faker.lorem.words();
    let description = faker.lorem.words();

    return {
      name,
      description,
    };
  }

  static getBoundaryTagDataPlusOne() {
    const name = randomstring.generate({ length: 191 + 1, charset: this.charset });
    const description = randomstring.generate();

    return {
      name,
      description,
    };
  }

  static getBoundaryTagData() {
    const name = randomstring.generate({ length: 191, charset: this.charset });
    const description = randomstring.generate();

    return {
      name,
      description,
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
