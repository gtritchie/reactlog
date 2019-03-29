// @flow

import _isNil from "lodash/isNil";

import type {
  EdgeLikeType,
  EdgeIdType,
  EdgeHoverKeyType,
  EdgeKeyType,
  GraphNodeKeyType,
} from "./Edge";
import { HoverStatus } from "./HoverStatus";

class GhostEdge {
  reactId: string;
  depOnReactId: string;
  time: number;
  hoverStatus: HoverStatus;
  isGhost: boolean;
  session: string;
  isDisplayed: boolean;

  constructor(data: GhostEdge | EdgeLikeType) {
    if (typeof data.reactId === "undefined")
      throw "data.reactId not provided to new GhostEdge()";
    if (typeof data.depOnReactId === "undefined")
      throw "data.depOnReactId not provided to new GhostEdge()";
    if (typeof data.time === "undefined")
      throw "data.time not provided to new GhostEdge()";
    this.reactId = data.reactId;
    this.depOnReactId = data.depOnReactId;
    this.session = _isNil(data.session) ? "Global" : data.session;
    this.time = data.time;
    this.isGhost = _isNil(data.isGhost) ? true : data.isGhost;
    this.hoverStatus = new HoverStatus(data.hoverStatus);
    this.isDisplayed = _isNil(data.isDisplayed) ? true : data.isDisplayed;
  }
  get id(): EdgeIdType {
    return `${this.reactId}_${this.depOnReactId}`.replace(/\$/g, "_");
  }
  get source(): GraphNodeKeyType {
    return this.depOnReactId.replace(/\$/g, "_");
  }
  get target(): GraphNodeKeyType {
    return this.reactId.replace(/\$/g, "_");
  }
  get key(): EdgeKeyType {
    return `${this.reactId} depends on ${this.depOnReactId}`;
  }
  get hoverKey(): EdgeHoverKeyType {
    return this.key;
  }
  get cytoStyle() {
    return {};
    // return graphStyles.ghostEdge.default
  }
  get cytoClasses(): string {
    let classes = ["edgeGhost"];
    switch (this.hoverStatus.state) {
      case HoverStatus.valFocused:
        break;
      case HoverStatus.valNotFocused:
        if (this.hoverStatus.sticky) {
          classes.push("edgeGhostHoverNotFocusedButSticky");
        } else {
          classes.push("edgeGhostHoverNotFocused");
        }
        break;
    }
    if (this.hoverStatus.selected) classes.push("edgeGhostSelected");
    if (!this.isDisplayed) classes.push("edgeHidden");
    return classes.join(" ");
  }
  get cytoData() {
    let retData = this;
    return {
      group: "edges",
      data: retData,
    };
  }
}

export { GhostEdge };
