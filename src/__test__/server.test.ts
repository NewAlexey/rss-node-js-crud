import { Server } from "../server";

jest.mock("../server", () => ({
  Server: jest
    .fn()
    .mockImplementation(() => ({ Server: { listen: () => jest.fn() } })),
}));

const PORT = 2007;

describe("Server base tests.", () => {
  it("1) Server should be initialized.", () => {
    const server = new Server(PORT);
    expect(server).toBeDefined();
  });

  it("2) Server should be called once..", () => {
    new Server(PORT);
    expect(Server).toHaveBeenCalledTimes(1);
  });

  it("Server should be called with current port.", () => {
    new Server(PORT);
    expect(Server).toHaveBeenCalledWith(PORT);
  });
});
