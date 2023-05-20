import { faker } from "@faker-js/faker";

export class StaffDataGenerator {
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

  static getValidStaffData() {
    return {
      username: "staff-member",
      email: "staff@staff.com",
    };
  }
}
