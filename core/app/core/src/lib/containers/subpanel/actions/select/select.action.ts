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

import {Injectable} from '@angular/core';
import {Action, Record} from 'common';
import {SubpanelActionData, SubpanelActionHandler} from '../subpanel.action';
import {RecordListModalComponent} from "../../../record-list-modal/components/record-list-modal/record-list-modal.component";
import {RecordListModalResult} from "../../../record-list-modal/components/record-list-modal/record-list-modal.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SubpanelActionsAdapter} from "../../adapters/subpanel-actions.adapter";


@Injectable({
    providedIn: 'root'
})
export class SubpanelSelectAction extends SubpanelActionHandler {
    key = 'select';

    constructor(
        protected subpanelAdaptor: SubpanelActionsAdapter,
        protected modalService: NgbModal

    ) {
        super();
    }

    run(data: SubpanelActionData): void {

        this.showSelectModal(data);
    }

    /**
     * Show record selection modal
     */
    protected showSelectModal(data: SubpanelActionData): void {
        const modal = this.modalService.open(RecordListModalComponent, {size: 'xl', scrollable: true});

        modal.componentInstance.module = data.module; //this.getRelatedModule();

        modal.result.then((result: RecordListModalResult) => {

            if (!result || !result.selection || !result.selection.selected) {
                return;
            }

            const record = this.getSelectedRecord(result);

            const action: Action =
                {
                    key: this.key,
                    asyncProcess: true,
                    params: {
                        store: data.store,
                        payload: {
                            baseModule: data.parentModule,
                            baseRecordId: data.parentId,
                            relateModule: record.module,
                            relateRecordId: record.id
                        }
                    }
                }
            this.subpanelAdaptor.runAction(action);
        });
    }


    /**
     * Get Selected Record
     *
     * @param {object} data RecordListModalResult
     * @returns {object} Record
     */
    protected getSelectedRecord(data: RecordListModalResult): Record {
        let id = '';
        Object.keys(data.selection.selected).some(selected => {
            id = selected;
            return true;
        });

        let record: Record = null;

        data.records.some(rec => {
            if (rec && rec.id === id) {
                record = rec;
                return true;
            }
        });

        return record;
    }

}
