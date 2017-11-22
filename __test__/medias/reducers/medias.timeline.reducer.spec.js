import reducer
    from "../../../src/frontend/modules/medias/reducers/medias.timeline.reducer"
import { actions } from "../../../src/frontend/modules"

describe('timeline reducer', () => {

    it('should return the initial state (Date.now())', () => {
        const initialState = reducer(undefined, {});
        const now = Date.now();
        expect(parseInt(initialState/1000)).toEqual(parseInt(now/1000));
    });

    it('should change state on MEDIAS_TIMELINE_UPDATE', ()=> {
        const date1 = new Date(2017, 1, 1);
        const date2 = new Date(2017, 2, 2);
        const action1 = actions.updateTimelineMedias({ value: date1.getTime() });
        const action2 = actions.updateTimelineMedias({ value: date2.getTime() });
        expect(reducer(undefined, action1)).toEqual(date1.getTime());
        expect(reducer(date1.getTime(), action2)).toEqual(date2.getTime());
    });
});