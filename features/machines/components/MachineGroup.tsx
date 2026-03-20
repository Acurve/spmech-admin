
import { LinkTag } from '@/components/shared'
import { ArrowRight, Plus } from 'lucide-react'
import { Text } from '@/components/typography/Text'
import ProductCard from '@/components/shared/ProductCard'

export type Machine = {
    id?: string,
    name: string,
    imageSrc: string,
    description?: string,
    href: string,
}

export type MachineGroupProps = {
    machines: Machine[],
    className?: string
    groupName: string,
    groupHref: string,
    groupDescription?: string,
}

const MachineGroup = ({ machines, groupName, groupHref, groupDescription = "", className = "" }: MachineGroupProps) => {
    return (
        <div className={className}>
            {/* Group Header */}
            <div className="flex items-end justify-between mb-6 border-b border-slate-200 pb-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-xl font-bold text-slate-900 uppercase">{groupName}</h2>
                        <span className="bg-slate-100 text-slate-600 py-0.5 px-2.5 rounded-full text-xs font-bold">
                            {machines.length} items
                        </span>
                    </div>
                    <p className="text-sm text-slate-500">{groupDescription}</p>
                </div>
                <LinkTag href={groupHref} className="hidden sm:flex items-center cursor-pointer font-semibold text-primary transition-colors">
                    <Text as='span' size='sm'>Manage category</Text>
                    <ArrowRight className="w-4 h-4 ml-1" />
                </LinkTag>
            </div>

            {
                machines.length &&

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 min-[1600px]:grid-cols-4 gap-6">
                    {machines.map((machine, index) => (
                        <ProductCard
                            key={`${machine.id}${index + 1}`}
                            href={machine.href}
                            imageSrc={machine.imageSrc}
                            description={machine.description}
                            name={machine.name}
                            id={`${machine.id}${index + 1}`}
                            linkText="view machine"
                        />
                    ))}


                </div>
            }
            {
                !machines.length &&
                <div className="flex items-center justify-center h-32">
                    <Text as='p' size='sm' className='text-muted-foreground'>No machines found</Text>
                </div>
            }
        </div>
    )
}

type GroupedMachines = Pick<MachineGroupProps, "groupName" | "groupDescription" | "groupHref" | "machines">

type MachineGroupContainerProps = {
    groupedMachines: GroupedMachines[]
}

const MachineGroupContainer = ({ groupedMachines }: MachineGroupContainerProps) => {
    return (
        <div className="space-y-4">
            {
                groupedMachines.map((group) => (
                    <MachineGroup
                        className='p-4 rounded-2xl ring-1 ring-sidebar-border bg-white'
                        key={group.groupName}
                        machines={group.machines}
                        groupHref={group.groupHref}
                        groupDescription={group.groupDescription}
                        groupName={group.groupName}
                    />
                ))
            }
        </div>
    )
}

export default MachineGroupContainer
