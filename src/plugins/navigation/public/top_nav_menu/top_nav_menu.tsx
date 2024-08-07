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

import React, { ReactElement } from 'react';
import { EuiHeaderLinks } from '@elastic/eui';
import classNames from 'classnames';

import { MountPoint } from '../../../../core/public';
import { MountPointPortal } from '../../../opensearch_dashboards_react/public';
import {
  StatefulSearchBarProps,
  DataPublicPluginStart,
  SearchBarProps,
} from '../../../data/public';
import { TopNavMenuData } from './top_nav_menu_data';
import { TopNavMenuItem } from './top_nav_menu_item';
import { DataSourceMenuProps, createDataSourceMenu } from '../../../data_source_management/public';

export type TopNavMenuProps = StatefulSearchBarProps &
  Omit<SearchBarProps, 'opensearchDashboards' | 'intl' | 'timeHistory'> & {
    config?: TopNavMenuData[];
    dataSourceMenuConfig?: DataSourceMenuProps;
    showSearchBar?: boolean;
    showQueryBar?: boolean;
    showQueryInput?: boolean;
    showDatePicker?: boolean;
    showFilterBar?: boolean;
    showDataSourceMenu?: boolean;
    data?: DataPublicPluginStart;
    className?: string;
    datePickerRef?: any;
    /**
     * If provided, the menu part of the component will be rendered as a portal inside the given mount point.
     *
     * This is meant to be used with the `setHeaderActionMenu` core API.
     *
     * @example
     * ```ts
     * export renderApp = ({ element, history, setHeaderActionMenu }: AppMountParameters) => {
     *   const topNavConfig = ...; // TopNavMenuProps
     *   return (
     *     <Router history=history>
     *       <TopNavMenu {...topNavConfig} setMenuMountPoint={setHeaderActionMenu}>
     *       <MyRoutes />
     *     </Router>
     *   )
     * }
     * ```
     */
    setMenuMountPoint?: (menuMount: MountPoint | undefined) => void;
  };

/*
 * Top Nav Menu is a convenience wrapper component for:
 * - Top navigation menu - configured by an array of `TopNavMenuData` objects
 * - Search Bar - which includes Filter Bar \ Query Input \ Timepicker.
 *
 * See SearchBar documentation to learn more about its properties.
 *
 **/

export function TopNavMenu(props: TopNavMenuProps): ReactElement | null {
  const {
    config,
    showSearchBar,
    showDataSourceMenu,
    dataSourceMenuConfig,
    ...searchBarProps
  } = props;

  if (
    (!config || config.length === 0) &&
    (!showSearchBar || !props.data) &&
    (!showDataSourceMenu || !dataSourceMenuConfig)
  ) {
    return null;
  }

  function renderItems(): ReactElement[] | null {
    if (!config || config.length === 0) return null;
    return config.map((menuItem: TopNavMenuData, i: number) => {
      return <TopNavMenuItem key={`nav-menu-${i}`} {...menuItem} />;
    });
  }

  function renderMenu(className: string): ReactElement | null {
    if ((!config || config.length === 0) && (!showDataSourceMenu || !dataSourceMenuConfig))
      return null;
    return (
      <EuiHeaderLinks data-test-subj="top-nav" gutterSize="xs" className={className}>
        {renderItems()}
        {renderDataSourceMenu()}
      </EuiHeaderLinks>
    );
  }

  function renderDataSourceMenu(): ReactElement | null {
    if (!showDataSourceMenu) return null;
    const DataSourceMenu = createDataSourceMenu();
    return <DataSourceMenu {...dataSourceMenuConfig!} />;
  }

  function renderSearchBar(): ReactElement | null {
    // Validate presence of all required fields
    if (!showSearchBar || !props.data) return null;
    const { SearchBar } = props.data.ui;
    return <SearchBar {...searchBarProps} />;
  }

  function renderLayout() {
    const { setMenuMountPoint } = props;
    const menuClassName = classNames('osdTopNavMenu', props.className);
    if (setMenuMountPoint) {
      return (
        <>
          <MountPointPortal setMountPoint={setMenuMountPoint}>
            {renderMenu(menuClassName)}
          </MountPointPortal>
          {renderSearchBar()}
        </>
      );
    } else {
      return (
        <>
          {renderMenu(menuClassName)}
          {renderSearchBar()}
        </>
      );
    }
  }

  return renderLayout();
}

TopNavMenu.defaultProps = {
  showSearchBar: false,
  showQueryBar: true,
  showQueryInput: true,
  showDatePicker: true,
  showFilterBar: true,
  showDataSourceMenu: false,
  screenTitle: '',
};
