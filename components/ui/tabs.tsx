'use client'

import * as React from 'react'
import { Tabs as ReactTabs, TabList, Tab, TabPanel, TabsProps, TabListProps, TabProps, TabPanelProps } from 'react-tabs'
import { cn } from '@/lib/utils'

// Wrapper to maintain compatibility with existing API
interface CustomTabsProps extends Omit<TabsProps, 'selectedIndex'> {
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}

function Tabs({ value, onValueChange, className, children, ...props }: CustomTabsProps) {
  // Map value strings to indices for react-tabs
  // Collect values from Tab triggers in order
  const tabValues = React.useMemo(() => {
    const values: string[] = []
    
    // Recursively find all Tab components (triggers) with value props
    const findTabValues = (node: any): void => {
      if (!node) return
      
      // If it's a React element with props
      if (typeof node === 'object' && node !== null) {
        // Check if this node has a value prop and is likely a Tab trigger
        // Tab triggers are typically wrapped by TabsList
        if (node.props) {
          // Skip TabPanel components - they have className that includes certain patterns
          const isPanel = node.type?.displayName?.includes('Panel') || 
                        node.props.className?.includes('tabs-content') ||
                        node.props['data-slot'] === 'tabs-content'
          
          if (!isPanel && node.props.value) {
            values.push(node.props.value)
          }
          
          // Recursively check children
          if (node.props.children) {
            React.Children.forEach(node.props.children, findTabValues)
          }
        }
      }
    }
    
    React.Children.forEach(children, findTabValues)
    return values
  }, [children])
  
  // Calculate initial selected index based on value prop
  const initialIndex = React.useMemo(() => {
    if (value !== undefined && tabValues.length > 0) {
      const index = tabValues.indexOf(value)
      return index >= 0 ? index : 0
    }
    return 0
  }, [value, tabValues])
  
  const [selectedIndex, setSelectedIndex] = React.useState(initialIndex)
  
  React.useEffect(() => {
    if (value !== undefined && tabValues.length > 0) {
      const index = tabValues.indexOf(value)
      if (index >= 0 && index !== selectedIndex) {
        setSelectedIndex(index)
      }
    }
  }, [value, tabValues, selectedIndex])
  
  const handleSelect = (index: number) => {
    setSelectedIndex(index)
    if (onValueChange && tabValues[index]) {
      onValueChange(tabValues[index])
    }
  }
  
  return (
    <ReactTabs
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      selectedIndex={selectedIndex}
      onSelect={handleSelect}
      {...props}
    >
      {children}
    </ReactTabs>
  )
}

function TabsList({ className, children, ...props }: TabListProps & { className?: string }) {
  return (
    <TabList
      data-slot="tabs-list"
      className={cn(
        'bg-transparent inline-flex h-auto items-center justify-center p-0',
        className,
      )}
      {...props}
    >
      {children}
    </TabList>
  )
}

function TabsTrigger({ className, value, children, ...props }: TabProps & { className?: string; value?: string }) {
  return (
    <Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      value={value}
      {...props}
    >
      {children}
    </Tab>
  )
}

function TabsContent({ className, value, children, ...props }: TabPanelProps & { className?: string; value?: string }) {
  return (
    <TabPanel
      data-slot="tabs-content"
      className={cn('outline-none', className)}
      value={value}
      {...props}
    >
      {children}
    </TabPanel>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
