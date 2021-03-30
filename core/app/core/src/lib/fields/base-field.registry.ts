/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {Type} from '@angular/core';
import {OverridableMap} from 'common';
import {BaseFieldComponent} from './base/base-field.component';
import {FieldComponentMap} from './field.model';

export interface FieldRegistryInterface {
    register(module: string, type: string, mode: string, component: Type<BaseFieldComponent>): void;

    exclude(module: string, key: string): void;

    get(module: string, type: string, mode: string): Type<BaseFieldComponent>;
}

export class BaseFieldRegistry implements FieldRegistryInterface {
    protected map: OverridableMap<Type<BaseFieldComponent>>;

    constructor() {
        this.init();
    }

    public register(module: string, type: string, mode: string, component: Type<BaseFieldComponent>): void {
        this.map.addEntry(module, BaseFieldRegistry.getKey(type, mode), component);
    }

    public exclude(module: string, key: string): void {
        this.map.excludeEntry(module, key);
    }

    public get(module: string, type: string, mode: string): Type<BaseFieldComponent> {

        const moduleFields = this.map.getGroupEntries(module);

        const key = BaseFieldRegistry.getKey(type, mode);
        if (moduleFields[key]) {
            return moduleFields[key];
        }

        const defaultKey = BaseFieldRegistry.getKey('varchar', mode);
        return moduleFields[defaultKey];
    }

    public static getKey(type: string, mode: string): string {
        return type + '.' + mode;
    }

    protected init(): void {
        this.map = new OverridableMap<Type<BaseFieldComponent>>();

        Object.keys(this.getDefaultMap()).forEach(key => {
            const [type, mode] = key.split('.', 2);
            this.register('default', type, mode, this.getDefaultMap()[key]);
        });
    }

    protected getDefaultMap(): FieldComponentMap {
        return {};
    }
}
