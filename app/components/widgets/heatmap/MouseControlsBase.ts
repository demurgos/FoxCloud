import { Vector2 } from 'three';

/**
* @author jeanpul http://github.com/jeanpul
*
* Provides interface to device pointer interaction mouse/touch events
*/
export class MouseControlsBase {

    private binders: any;
    public enabled: boolean;
    protected userInteraction: boolean;
    protected mouseSpeedFactor: number;
    protected touchSpeedFactor: number;
    protected wheelSpeedFactor: number[]; // indexed by deltaMode see WheelEvent properties

    protected touchStart: Vector2;
    protected touchEnd: Vector2;
    protected touchDelta: Vector2;

    protected onUserInteractionEvent: (x:any)=>void | undefined;

    constructor(private scope: any, protected params: any) {

        this.params = params;

        this.scope = scope;

        this.params.clickClass = params.clickClass || 'vrplayer-camera-move';
        this.params.clickToInteract = params.clickToInteract !== undefined ? params.clickToInteract : true;
        this.params.stopOnLeave = params.stopOnLeave !== undefined ? params.stopOnLeave : true;
        this.params.clickOutside = params.clickOutside !== undefined ? params.clickOutside : true;

        this.binders = {
            'onMouseDown': { evt: 'mousedown', bind: null, capture: false, scope: null },
            'onMouseUp': { evt: 'mouseup', bind: null, capture: false, scope: null },
            'onMouseMove': { evt: 'mousemove', bind: null, capture: false, scope: null },
            'onTouchStart': { evt: 'touchstart', bind: null, capture: false, scope: null },
            'onTouchEnd': { evt: 'touchend', bind: null, capture: false, scope: null },
            'onTouchMove': { evt: 'touchmove', bind: null, capture: false, scope: null },
            'onMouseEnter': { evt: 'mouseenter', bind: null, capture: false, scope: null },
            'onMouseLeave': { evt: 'mouseleave', bind: null, capture: false, scope: null },
            'onMouseWheel': { evt: 'wheel', bind: null, capture: false, scope: null }
        };

        this.enabled = true;
        this.userInteraction = false;

        this.mouseSpeedFactor = 2;
        this.touchSpeedFactor = 2;
        this.wheelSpeedFactor = [0.88, 0.88, 0.88]; // indexed by deltaMode see WheelEvent properties

        this.touchStart = new Vector2();
        this.touchEnd = new Vector2();
        this.touchDelta = new Vector2();

        this.onUserInteractionEvent = undefined;

    }

    setUserInteractionEvent(f: (x:any) => void) {
        this.onUserInteractionEvent = f;
    }

    setMouseSpeedFactor(v: number) {
        this.mouseSpeedFactor = v;
    }

    setTouchSpeedFactor(v: number) {
        this.touchSpeedFactor = v;
    }

    getTouchSpeedFactor() {
        return this.touchSpeedFactor;
    }

    setWheelSpeedFactor(v: number[]) {
        this.wheelSpeedFactor = v;
    }

    setInteraction(v: boolean) {
        this.userInteraction = v;
        if (this.userInteraction) {
            this.scope.classList.add(this.params.clickClass);
        } else {
            this.scope.classList.remove(this.params.clickClass);
        }
        if (this.onUserInteractionEvent !== undefined) {
            this.onUserInteractionEvent(this.userInteraction);
        }
    }

    onMouseDown(event: any) {

        if (!this.enabled) {
            return;
        }

        if (this.params.clickToInteract) {
            if (event.which === 1) {
                this.touchStart.set(event.pageX, event.pageY);
                this.setInteraction(true);
            }
        }

    }

    onMouseUp(event: any) {

        if (!this.enabled) {
            return;
        }

        if (this.params.clickToInteract) {
            if (event.which === 1) { // does not work for left handed mouse
                this.setInteraction(false);
            }
        }
    }

    onMouseMove(event: any) {

        if (!this.enabled || !this.userInteraction) {
            return;
        }

        event.preventDefault();

        this.touchEnd.set(event.pageX, event.pageY);
        this.touchDelta.set(
            (this.touchStart.x - this.touchEnd.x) * this.mouseSpeedFactor,
            (this.touchStart.y - this.touchEnd.y) * this.mouseSpeedFactor
        );
        this.touchStart.copy(this.touchEnd);

        this.doMove(this.touchDelta);

    }

    onMouseLeave(event: any) {

        if (this.enabled === false) return;

        if (this.params.clickToInteract && this.params.stopOnLeave && (event.buttons === 1)) {
            // when the user leave the player while left mouse button still pressed
            this.onMouseUp({ which: 1 });
        }
    }

    onMouseEnter(event: any) {

        if (this.enabled === false) return;

        if (this.params.clickOutside) {
            // so you can trigger the left mouse before entering the player
            var which = event.buttons;
            this.onMouseDown({ which: which, pageX: event.pageX, pageY: event.pageY });
        }
    }

    onTouchStart(event: any) {
        if (!this.enabled) {
            return;
        }
        if (event.touches.length === 1) {
            this.touchStart.set(event.touches[0].pageX, event.touches[0].pageY);
            this.setInteraction(true);
        }
    }

    onTouchEnd(event: any) {
        if (!this.enabled) {
            return;
        }
        this.setInteraction(false);
    }

    onTouchMove(event: any) {
        if (!this.enabled) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();

        if (event.touches.length === 1) {
            this.touchEnd.set(event.touches[0].pageX, event.touches[0].pageY);
            this.touchDelta.set(
                (this.touchStart.x - this.touchEnd.x) * this.touchSpeedFactor,
                (this.touchStart.y - this.touchEnd.y) * this.touchSpeedFactor
            );
            this.touchStart.copy(this.touchEnd);
            this.doMove(this.touchDelta);
        }
    }

    onMouseWheel(event: any) {
        if (!this.enabled) {
            return;
        }
        event.preventDefault();
        this.touchDelta.set(
            event.deltaY * this.wheelSpeedFactor[event.deltaMode],
            0
        );
        this.doMove(this.touchDelta);
    }
    // to be overloaded
    doMove(delta: any) {
        throw Error('doMove Must be overloaded');
    }

    rebindAll() {
        for (var key in this.binders) {
            var elt = this.binders[key];
            elt.bind = (<any> this)[key].bind(this);
            elt.scope = this.scope;
        }
    }

    listenAll() {
        this._apply_generic('addEventListener');
    }

    disposeAll() {
        this._apply_generic('removeEventListener');
    }

    _apply_generic(fScope: any) {
        for (var key in this.binders) {
            var elt = this.binders[key];
            elt.scope[fScope](elt.evt, elt.bind, elt.capture);
        }
    }

    rescopeBind(bindkey: any, scope: any) {
        this.binders[bindkey].scope = scope;
    }

    removeBind(bindKey: any) {
        delete this.binders[bindKey];
    }

    getBind(bindKey: any) {
        return this.binders[bindKey];
    }

}
