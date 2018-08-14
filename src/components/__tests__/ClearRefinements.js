import { mount } from '@vue/test-utils';
import { __setState } from '../../component';
import ClearRefinements from '../ClearRefinements.vue';

jest.mock('../../component');

const defaultState = {
  hasRefinements: true,
  refine: () => {},
  createURL: () => {},
};

it('accepts an clearsQuery prop', () => {
  __setState({
    ...defaultState,
  });

  const wrapper = mount(ClearRefinements, {
    propsData: {
      clearsQuery: true,
    },
  });

  expect(wrapper.vm.widgetParams.clearsQuery).toBe(true);
});

it('accepts an excludeAttributes prop', () => {
  __setState({
    ...defaultState,
  });

  const wrapper = mount(ClearRefinements, {
    propsData: {
      excludedAttributes: ['brand'],
    },
  });

  expect(wrapper.vm.widgetParams.excludeAttributes).toEqual(['brand']);
});

it('accepts a transformItems prop', () => {
  __setState({
    ...defaultState,
  });

  const transformItems = x => x;

  const wrapper = mount(ClearRefinements, {
    propsData: {
      transformItems,
    },
  });

  expect(wrapper.vm.widgetParams.transformItems).toBe(transformItems);
});

describe('default render', () => {
  it('renders correctly', () => {
    __setState({
      ...defaultState,
    });

    const wrapper = mount(ClearRefinements);

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders correctly without refinements', () => {
    __setState({
      ...defaultState,
      hasRefinements: false,
    });

    const wrapper = mount(ClearRefinements);

    const button = wrapper.find('button');

    expect(button.attributes().disabled).toBe('disabled');
    expect(button.classes()).toContain('ais-ClearRefinements-button--disabled');
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('calls refine on button click', () => {
    const refine = jest.fn();

    __setState({
      ...defaultState,
      refine,
    });

    const wrapper = mount(ClearRefinements);

    wrapper.find('button').trigger('click');

    expect(refine).toHaveBeenCalledTimes(1);
  });
});

describe('custom default render', () => {
  const defaultScopedSlot = `
    <div
      slot-scope="{ canRefine, refine, createURL }"
      :class="[!canRefine && 'no-refinement']"
    >
      <a :href="createURL()" @click.prevent="refine">
        Clear refinements
      </a>
    </div>
  `;

  it('renders correctly', () => {
    __setState({
      ...defaultState,
    });

    const wrapper = mount(ClearRefinements, {
      scopedSlots: {
        default: defaultScopedSlot,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders correctly without refinement', () => {
    __setState({
      ...defaultState,
      hasRefinements: false,
    });

    const wrapper = mount(ClearRefinements, {
      scopedSlots: {
        default: defaultScopedSlot,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders correctly with an URL for the href', () => {
    __setState({
      ...defaultState,
      createURL: () => `/clear/refinements`,
    });

    const wrapper = mount(ClearRefinements, {
      scopedSlots: {
        default: defaultScopedSlot,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('calls refine on link click', () => {
    const refine = jest.fn();

    __setState({
      ...defaultState,
      refine,
    });

    const wrapper = mount(ClearRefinements, {
      scopedSlots: {
        default: defaultScopedSlot,
      },
    });

    wrapper.find('a').trigger('click');

    expect(refine).toHaveBeenCalledTimes(1);
  });
});

describe('custom resetLabel render', () => {
  const resetLabelSlot = `
    <span>Remove the refinements</span>
  `;

  it('renders correctly with a custom reset label', () => {
    __setState({ ...defaultState });

    const wrapper = mount(ClearRefinements, {
      slots: {
        resetLabel: resetLabelSlot,
      },
    });

    expect(wrapper.find('button').text()).toBe('Remove the refinements');
    expect(wrapper.html()).toMatchSnapshot();
  });
});
