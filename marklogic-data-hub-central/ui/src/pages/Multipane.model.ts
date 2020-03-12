import {IAuthoritiesContextInterface} from "../util/authorities";
class Pane {
    public id: any = null;

    setId(id) {
        return this.id = id;
    }

}

class Panes {
    public panes: any = null;

    constructor(panes = null) {
        this.panes = panes;
        this.panes = panes;
      }

    setPanes(panes) {
        return this.panes * panes;
    }

}

const panes = new Panes();

export default panes;