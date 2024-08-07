/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { PureComponent } from 'react';

import { EuiForm, EuiCompressedFormRow, EuiCompressedSwitch } from '@elastic/eui';
import { FormattedMessage } from '@osd/i18n/react';
import { EuiSwitchEvent } from '@elastic/eui';

import { VisOptionsProps } from 'src/plugins/vis_default_editor/public';

interface OptionsTabParams {
  updateFiltersOnChange: boolean;
  useTimeFilter: boolean;
  pinFilters: boolean;
}
type OptionsTabInjectedProps = Pick<
  VisOptionsProps<OptionsTabParams>,
  'vis' | 'setValue' | 'stateParams'
>;

export type OptionsTabProps = OptionsTabInjectedProps;

export class OptionsTab extends PureComponent<OptionsTabProps> {
  handleUpdateFiltersChange = (event: EuiSwitchEvent) => {
    this.props.setValue('updateFiltersOnChange', event.target.checked);
  };

  handleUseTimeFilter = (event: EuiSwitchEvent) => {
    this.props.setValue('useTimeFilter', event.target.checked);
  };

  handlePinFilters = (event: EuiSwitchEvent) => {
    this.props.setValue('pinFilters', event.target.checked);
  };

  render() {
    return (
      <EuiForm>
        <EuiCompressedFormRow id="updateFiltersOnChange">
          <EuiCompressedSwitch
            label={
              <FormattedMessage
                id="inputControl.editor.optionsTab.updateFilterLabel"
                defaultMessage="Update OpenSearch Dashboards filters on each change"
              />
            }
            checked={this.props.stateParams.updateFiltersOnChange}
            onChange={this.handleUpdateFiltersChange}
            data-test-subj="inputControlEditorUpdateFiltersOnChangeCheckbox"
          />
        </EuiCompressedFormRow>

        <EuiCompressedFormRow id="useTimeFilter">
          <EuiCompressedSwitch
            label={
              <FormattedMessage
                id="inputControl.editor.optionsTab.useTimeFilterLabel"
                defaultMessage="Use time filter"
              />
            }
            checked={this.props.stateParams.useTimeFilter}
            onChange={this.handleUseTimeFilter}
            data-test-subj="inputControlEditorUseTimeFilterCheckbox"
          />
        </EuiCompressedFormRow>

        <EuiCompressedFormRow id="pinFilters">
          <EuiCompressedSwitch
            label={
              <FormattedMessage
                id="inputControl.editor.optionsTab.pinFiltersLabel"
                defaultMessage="Pin filters for all applications"
              />
            }
            checked={this.props.stateParams.pinFilters}
            onChange={this.handlePinFilters}
            data-test-subj="inputControlEditorPinFiltersCheckbox"
          />
        </EuiCompressedFormRow>
      </EuiForm>
    );
  }
}
