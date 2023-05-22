import { faker } from "@faker-js/faker";
import randomstring from "randomstring";

export class PostDataGenerator {
  static charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+{}[]|;:,.<>?/";

  static getRandomPostData() {
    let title = faker.lorem.words();
    let content = faker.lorem.words();

    return {
      title,
      content,
    };
  }

  static getBoundaryPostDataPlusOne() {
    const title = randomstring.generate({ length: 255 + 1, charset: this.charset });
    const content = randomstring.generate();

    return {
      title,
      content,
    };
  }

  static getBoundaryPostData() {
    const title = randomstring.generate({ length: 255, charset: this.charset });
    const content = randomstring.generate();

    return {
      title,
      content,
    };
  }

  static getValidPostData() {
    return {
      title: "New post title",
      content: "New post content",
    };
  }

  static getValidUpdatedPostData() {
    return {
      title: "Updated post title",
      content: "Updated post content",
    };
  }

  static getBoundaryPageMetaData() {
    const title = randomstring.generate({ length: 70, charset: this.charset });
    const description = randomstring.generate({ length: 156, charset: this.charset });

    return {
      title,
      description,
    };
  }

  static getBoundaryPageMetaDataPlusOne() {
    const title = randomstring.generate({ length: 70 + 1, charset: this.charset });
    const description = randomstring.generate({ length: 156 + 1, charset: this.charset });

    return {
      title,
      description,
    };
  }
}
