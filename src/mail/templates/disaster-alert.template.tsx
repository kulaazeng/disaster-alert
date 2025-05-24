import { Body, Heading, Tailwind, Text } from "@react-email/components"
import { Html } from "@react-email/html"
import * as React from 'react'

interface DisasterAlertTemplateProps {
	regionId: string
	disasterType: string
	riskLevel: string
}

export function DisasterAlertTemplate({
		regionId,
		disasterType,
		riskLevel
}: DisasterAlertTemplateProps) {
	return (
		<Tailwind>
			<Html>
				<Body className='text-black'>
					<Heading>Disaster Alert</Heading>
					<Text>There is a disaster alert for region: {regionId} and disaster type: {disasterType} with risk level: {riskLevel}</Text>
				</Body>
			</Html>
		</Tailwind>
	)
}
